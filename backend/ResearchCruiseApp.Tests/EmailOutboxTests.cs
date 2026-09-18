using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Identity;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging.Abstractions;
using Microsoft.Extensions.Options;
using ResearchCruiseApp.Infrastructure.Email;
using ResearchCruiseApp.Infrastructure.Identity;
using ResearchCruiseApp.Infrastructure.Identity.Contracts;
using ResearchCruiseApp.Infrastructure.Localization;
using ResearchCruiseApp.Infrastructure.Persistence;
using Xunit;

namespace ResearchCruiseApp.Tests;

public sealed class EmailOutboxTests
{
    [Theory]
    [InlineData(true)]
    [InlineData(false)]
    public async Task SeedAccountAndEmailFollowTheExistingTransaction(bool commit)
    {
        await using var fixture = await OutboxFixture.Create();
        await using (var scope = fixture.Provider.CreateAsyncScope())
        {
            var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
            await using var transaction = await db.Database.BeginTransactionAsync();
            var identity = OutboxFixture.CreateIdentity(scope.ServiceProvider);
            var result = await identity.EnsureSeedUserWithRole(
                "seed@example.com",
                "Seed",
                "User",
                "ValidPassword1!",
                "CruiseManager"
            );
            Assert.True(result.IsSuccess);
            Assert.Same(transaction, db.Database.CurrentTransaction);
            Assert.Single(await db.EmailOutboxMessages.ToListAsync());
            if (commit)
                await transaction.CommitAsync();
            else
                await transaction.RollbackAsync();
        }
        await using var verification = fixture.OpenDb();
        Assert.Equal(commit ? 1 : 0, await verification.Users.CountAsync());
        Assert.Equal(commit ? 1 : 0, await verification.EmailOutboxMessages.CountAsync());
    }

    [Theory]
    [InlineData(true)]
    [InlineData(false)]
    public async Task FailedSeedRepairPreservesTheOriginalAccountInExistingTransaction(
        bool queueFailure
    )
    {
        await using var fixture = await OutboxFixture.Create();
        string originalId;
        await using (var scope = fixture.Provider.CreateAsyncScope())
        {
            var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
            var users = scope.ServiceProvider.GetRequiredService<UserManager<User>>();
            var original = new User
            {
                UserName = "seed@example.com",
                Email = "seed@example.com",
                FirstName = "Seed",
                LastName = "User",
            };
            Assert.True((await users.CreateAsync(original)).Succeeded);
            originalId = original.Id;
            await using var transaction = await db.Database.BeginTransactionAsync();
            var identity = OutboxFixture.CreateIdentity(scope.ServiceProvider);
            fixture.SaveFailure.FailOutboxWrites = queueFailure;
            if (queueFailure)
                await Assert.ThrowsAsync<DbUpdateException>(() =>
                    identity.EnsureSeedUserWithRole(
                        "seed@example.com",
                        "Seed",
                        "User",
                        "ValidPassword1!",
                        "CruiseManager"
                    )
                );
            else
                Assert.False(
                    (
                        await identity.EnsureSeedUserWithRole(
                            "seed@example.com",
                            "Seed",
                            "User",
                            "bad",
                            "CruiseManager"
                        )
                    ).IsSuccess
                );
            Assert.Same(transaction, db.Database.CurrentTransaction);
            await transaction.CommitAsync();
        }
        await using var verification = fixture.OpenDb();
        Assert.Equal(originalId, (await verification.Users.SingleAsync()).Id);
        Assert.Empty(await verification.EmailOutboxMessages.ToListAsync());
    }

    [Fact]
    public async Task QueuedEmailAndProtectionKeysSurviveAHostRestart()
    {
        await using var fixture = await OutboxFixture.Create();
        await fixture.Enqueue();
        await using (var db = fixture.OpenDb())
        {
            var stored = await db.EmailOutboxMessages.SingleAsync();
            Assert.DoesNotContain(
                "recipient@example.com",
                stored.ProtectedPayload,
                StringComparison.Ordinal
            );
            Assert.DoesNotContain(
                "sensitive-body",
                stored.ProtectedPayload,
                StringComparison.Ordinal
            );
            Assert.NotEmpty(await db.DataProtectionKeys.ToListAsync());
        }

        await using var restartedProvider = fixture.CreateProvider();
        await fixture.Dispatch(restartedProvider);

        var delivered = Assert.Single(fixture.Transport.Delivered);
        Assert.Equal("sensitive-body", delivered.Payload.Body);
        await using var verification = fixture.OpenDb();
        Assert.Empty(await verification.EmailOutboxMessages.ToListAsync());
    }

    [Fact]
    public async Task FailureIsDurableAndRetriesOnlyWhenDueUsingTheSameMessageId()
    {
        await using var fixture = await OutboxFixture.Create();
        await fixture.Enqueue();
        fixture.Transport.Fail = true;
        await fixture.Dispatch();
        await using (var db = fixture.OpenDb())
        {
            var pending = await db.EmailOutboxMessages.SingleAsync();
            Assert.Equal(1, pending.Attempts);
            Assert.Null(pending.LeaseId);
            Assert.Equal(fixture.Clock.UtcNow.AddSeconds(30).UtcDateTime, pending.NextAttemptAt);
        }
        fixture.Transport.Fail = false;
        await fixture.Dispatch();
        Assert.Single(fixture.Transport.Attempted);
        fixture.Clock.Advance(TimeSpan.FromSeconds(30));
        await fixture.Dispatch();
        Assert.Equal(2, fixture.Transport.Attempted.Count);
        Assert.Equal(fixture.Transport.Attempted[0], fixture.Transport.Attempted[1]);
        Assert.Single(fixture.Transport.Delivered);
    }

    [Fact]
    public async Task AnotherWorkerCannotDeliverAnActivelyLeasedMessage()
    {
        await using var fixture = await OutboxFixture.Create();
        await fixture.Enqueue();
        var entered = new TaskCompletionSource(TaskCreationOptions.RunContinuationsAsynchronously);
        var release = new TaskCompletionSource(TaskCreationOptions.RunContinuationsAsynchronously);
        fixture.Transport.BeforeDelivery = async token =>
        {
            entered.SetResult();
            await release.Task.WaitAsync(token);
        };
        var first = fixture.Dispatch();
        try
        {
            await entered.Task.WaitAsync(TimeSpan.FromSeconds(10));
            await fixture.Dispatch();
            Assert.Single(fixture.Transport.Attempted);
        }
        finally
        {
            release.TrySetResult();
            await first;
        }
        Assert.Single(fixture.Transport.Delivered);
    }

    [Fact]
    public async Task ExpiredLeaseIsRecoveredAfterACrash()
    {
        await using var fixture = await OutboxFixture.Create();
        await fixture.Enqueue();
        await using (var db = fixture.OpenDb())
        {
            var pending = await db.EmailOutboxMessages.SingleAsync();
            pending.LeaseId = Guid.NewGuid();
            pending.LeaseExpiresAt = fixture.Clock.UtcNow.AddMinutes(5).UtcDateTime;
            await db.SaveChangesAsync();
        }
        await fixture.Dispatch();
        Assert.Empty(fixture.Transport.Attempted);
        fixture.Clock.Advance(TimeSpan.FromMinutes(5));
        await fixture.Dispatch();
        Assert.Single(fixture.Transport.Delivered);
    }

    [Theory]
    [InlineData(true)]
    [InlineData(false)]
    public async Task ExpiredOrExhaustedMessagesAreNotSentAndSensitivePayloadIsCleared(bool expired)
    {
        await using var fixture = await OutboxFixture.Create();
        await fixture.Enqueue();
        await using (var db = fixture.OpenDb())
        {
            var pending = await db.EmailOutboxMessages.SingleAsync();
            if (expired)
                pending.ExpiresAt = fixture.Clock.UtcNow.UtcDateTime;
            else
                pending.Attempts = EmailOutboxDispatcher.MaximumAttempts;
            await db.SaveChangesAsync();
        }
        await fixture.Dispatch();
        Assert.Empty(fixture.Transport.Attempted);
        await using (var db = fixture.OpenDb())
        {
            var failed = await db.EmailOutboxMessages.SingleAsync();
            Assert.NotNull(failed.FailedAt);
            Assert.Equal("", failed.ProtectedPayload);
        }
        fixture.Clock.Advance(TimeSpan.FromDays(8));
        await fixture.Dispatch();
        await using var verification = fixture.OpenDb();
        Assert.Empty(await verification.EmailOutboxMessages.ToListAsync());
    }

    [Fact]
    public async Task ShutdownLeavesTheMessageRecoverable()
    {
        await using var fixture = await OutboxFixture.Create();
        await fixture.Enqueue();
        using var cancellation = new CancellationTokenSource();
        fixture.Transport.BeforeDelivery = token =>
        {
            cancellation.Cancel();
            token.ThrowIfCancellationRequested();
            return Task.CompletedTask;
        };
        await Assert.ThrowsAnyAsync<OperationCanceledException>(() =>
            fixture.Dispatch(cancellationToken: cancellation.Token)
        );
        await using (var db = fixture.OpenDb())
        {
            var pending = await db.EmailOutboxMessages.SingleAsync();
            Assert.NotNull(pending.LeaseId);
            Assert.NotEmpty(pending.ProtectedPayload);
        }
        fixture.Transport.BeforeDelivery = null;
        fixture.Clock.Advance(TimeSpan.FromMinutes(5));
        await fixture.Dispatch();
        Assert.Single(fixture.Transport.Delivered);
    }

    [Fact]
    public async Task RegistrationSucceedsDuringSmtpOutageAndCreatesOneAccountAndOnePendingEmail()
    {
        await using var fixture = await OutboxFixture.Create();
        fixture.Transport.Fail = true;
        await using (var scope = fixture.Provider.CreateAsyncScope())
        {
            var identity = OutboxFixture.CreateIdentity(scope.ServiceProvider);
            Assert.True((await identity.RegisterUser(Registration(), "CruiseManager")).IsSuccess);
            Assert.False((await identity.RegisterUser(Registration(), "CruiseManager")).IsSuccess);
            Assert.Empty(fixture.Transport.Attempted);
        }
        await fixture.Dispatch();
        await using var db = fixture.OpenDb();
        Assert.Single(await db.Users.ToListAsync());
        Assert.Equal(1, (await db.EmailOutboxMessages.SingleAsync()).Attempts);
        Assert.Empty(fixture.Transport.Delivered);
    }

    [Fact]
    public async Task RegistrationRollsBackTheAccountWhenQueuePersistenceFails()
    {
        await using var fixture = await OutboxFixture.Create();
        fixture.SaveFailure.FailOutboxWrites = true;
        await using (var scope = fixture.Provider.CreateAsyncScope())
        {
            var identity = OutboxFixture.CreateIdentity(scope.ServiceProvider);
            await Assert.ThrowsAsync<DbUpdateException>(() =>
                identity.RegisterUser(Registration(), "CruiseManager")
            );
        }
        await using var db = fixture.OpenDb();
        Assert.Empty(await db.Users.ToListAsync());
        Assert.Empty(await db.EmailOutboxMessages.ToListAsync());
    }

    [Fact]
    public async Task QueueWriteRollsBackWithItsCallerTransaction()
    {
        await using var fixture = await OutboxFixture.Create();
        await using (var scope = fixture.Provider.CreateAsyncScope())
        {
            var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
            await using var transaction = await db.Database.BeginTransactionAsync();
            await scope
                .ServiceProvider.GetRequiredService<EmailOutbox>()
                .Enqueue("recipient@example.com", "subject", "body");
            await transaction.RollbackAsync();
        }
        await fixture.Dispatch();
        Assert.Empty(fixture.Transport.Attempted);
    }

    [Fact]
    public async Task FakeDeliveryIsIdempotentForTheSameMessageId()
    {
        var directory = Path.Combine(Path.GetTempPath(), Guid.NewGuid().ToString());
        try
        {
            var transport = new FakeEmailTransport(
                Options.Create(
                    new SmtpSettings { UseFakeSmtp = true, FakeSmtpDirectory = directory }
                )
            );
            var id = Guid.NewGuid();
            var payload = new EmailPayload("recipient@example.com", "subject", "body");
            await transport.Deliver(id, payload, CancellationToken.None);
            await transport.Deliver(id, payload, CancellationToken.None);
            Assert.Single(Directory.GetFiles(directory));
            Assert.Contains(
                "body",
                await File.ReadAllTextAsync(Path.Combine(directory, $"{id:N}.html")),
                StringComparison.Ordinal
            );
        }
        finally
        {
            if (Directory.Exists(directory))
                Directory.Delete(directory, recursive: true);
        }
    }

    [Fact]
    public async Task AFinalFailedAttemptClearsPayloadAndDoesNotBlockTheNextMessage()
    {
        await using var fixture = await OutboxFixture.Create();
        await fixture.Enqueue();
        await using (var db = fixture.OpenDb())
        {
            var pending = await db.EmailOutboxMessages.SingleAsync();
            pending.Attempts = EmailOutboxDispatcher.MaximumAttempts - 1;
            await db.SaveChangesAsync();
        }
        fixture.Clock.Advance(TimeSpan.FromSeconds(1));
        await fixture.Enqueue();
        fixture.Transport.BeforeDelivery = _ =>
        {
            if (fixture.Transport.Attempted.Count == 1)
                throw new IOException("Simulated permanent failure");
            return Task.CompletedTask;
        };
        await fixture.Dispatch();
        Assert.Single(fixture.Transport.Delivered);
        await using var verification = fixture.OpenDb();
        var failed = await verification.EmailOutboxMessages.SingleAsync();
        Assert.Equal(EmailOutboxDispatcher.MaximumAttempts, failed.Attempts);
        Assert.NotNull(failed.FailedAt);
        Assert.Equal("", failed.ProtectedPayload);
    }

    private static RegisterFormDto Registration() =>
        new()
        {
            Email = "registration@example.com",
            FirstName = "Test",
            LastName = "Registration",
            Password = "ValidPassword1!",
        };

    private sealed class OutboxFixture : IAsyncDisposable
    {
        private readonly string? _sqlServer = Environment.GetEnvironmentVariable(
            "RESEARCHCRUISE_TEST_SQLSERVER"
        );
        private readonly string _databaseName = "EmailOutboxTests_" + Guid.NewGuid().ToString("N");
        private readonly string _directory = Path.Combine(
            Path.GetTempPath(),
            Guid.NewGuid().ToString()
        );
        public TestClock Clock { get; } = new();
        public RecordingTransport Transport { get; } = new();
        public QueueSaveFailure SaveFailure { get; } = new();
        public ServiceProvider Provider { get; private set; } = null!;
        private string ConnectionString =>
            _sqlServer is null
                ? $"Data Source={Path.Combine(_directory, "outbox.db")};Pooling=False"
                : new SqlConnectionStringBuilder(_sqlServer)
                {
                    InitialCatalog = _databaseName,
                }.ConnectionString;

        private DbContextOptionsBuilder Configure(DbContextOptionsBuilder options) =>
            _sqlServer is null
                ? options.UseSqlite(ConnectionString)
                : options.UseSqlServer(ConnectionString);

        public static async Task<OutboxFixture> Create()
        {
            var fixture = new OutboxFixture();
            Directory.CreateDirectory(fixture._directory);
            fixture.Provider = fixture.CreateProvider();
            await using var scope = fixture.Provider.CreateAsyncScope();
            var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
            await db.Database.EnsureCreatedAsync();
            var roles = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
            await roles.CreateAsync(new IdentityRole("CruiseManager"));
            // Persist the initial key before business transactions acquire SQLite's write lock.
            fixture
                .Provider.GetRequiredService<IDataProtectionProvider>()
                .CreateProtector("warmup")
                .Protect("warmup");
            return fixture;
        }

        public ServiceProvider CreateProvider()
        {
            var services = new ServiceCollection();
            services.AddLogging();
            services.AddDbContext<ApplicationDbContext>(options =>
                Configure(options).AddInterceptors(SaveFailure)
            );
            services
                .AddDataProtection()
                .SetApplicationName("OutboxTests")
                .PersistKeysToDbContext<ApplicationDbContext>();
            services
                .AddIdentityCore<User>()
                .AddRoles<IdentityRole>()
                .AddEntityFrameworkStores<ApplicationDbContext>()
                .AddDefaultTokenProviders();
            services.AddSingleton<TimeProvider>(Clock);
            services.AddSingleton<IEmailTransport>(Transport);
            services.AddScoped<EmailOutbox>();
            services.AddScoped<EmailOutboxDispatcher>();
            return services.BuildServiceProvider();
        }

        public ApplicationDbContext OpenDb()
        {
            var options = new DbContextOptionsBuilder<ApplicationDbContext>();
            Configure(options);
            return new ApplicationDbContext(options.Options);
        }

        public async Task Enqueue()
        {
            await using var scope = Provider.CreateAsyncScope();
            await scope
                .ServiceProvider.GetRequiredService<EmailOutbox>()
                .Enqueue("recipient@example.com", "subject", "sensitive-body");
        }

        public async Task Dispatch(
            ServiceProvider? provider = null,
            CancellationToken cancellationToken = default
        )
        {
            await using var scope = (provider ?? Provider).CreateAsyncScope();
            await scope
                .ServiceProvider.GetRequiredService<EmailOutboxDispatcher>()
                .DispatchBatch(cancellationToken);
        }

        public static IdentityService CreateIdentity(IServiceProvider provider)
        {
            var config = new ConfigurationBuilder()
                .AddInMemoryCollection(
                    new Dictionary<string, string?> { ["FrontendUrl"] = "https://example.com" }
                )
                .Build();
            var email = new EmailSender(
                config,
                new TemplateFileReader(AppContext.BaseDirectory),
                new GlobalizationService(),
                provider.GetRequiredService<EmailOutbox>()
            );
            return new IdentityService(
                provider.GetRequiredService<UserManager<User>>(),
                provider.GetRequiredService<RoleManager<IdentityRole>>(),
                email,
                null!,
                null!,
                config,
                provider.GetRequiredService<ApplicationDbContext>(),
                NullLogger<IdentityService>.Instance
            );
        }

        public async ValueTask DisposeAsync()
        {
            await Provider.DisposeAsync();
            if (_sqlServer is not null)
            {
                // The database name is generated by this fixture, never taken from the environment.
                await using var db = OpenDb();
                await db.Database.EnsureDeletedAsync();
            }
            Directory.Delete(_directory, recursive: true);
        }
    }

    private sealed class TestClock : TimeProvider
    {
        public DateTimeOffset UtcNow { get; private set; } =
            new(2026, 9, 17, 12, 0, 0, TimeSpan.Zero);

        public override DateTimeOffset GetUtcNow() => UtcNow;

        public void Advance(TimeSpan interval) => UtcNow += interval;
    }

    private sealed class RecordingTransport : IEmailTransport
    {
        public bool Fail { get; set; }
        public Func<CancellationToken, Task>? BeforeDelivery { get; set; }
        public List<Guid> Attempted { get; } = [];
        public List<(Guid Id, EmailPayload Payload)> Delivered { get; } = [];

        public async Task Deliver(
            Guid id,
            EmailPayload payload,
            CancellationToken cancellationToken
        )
        {
            Attempted.Add(id);
            if (BeforeDelivery is not null)
                await BeforeDelivery(cancellationToken);
            if (Fail)
                throw new IOException("Simulated SMTP outage");
            Delivered.Add((id, payload));
        }
    }

    private sealed class QueueSaveFailure : SaveChangesInterceptor
    {
        public bool FailOutboxWrites { get; set; }

        public override ValueTask<InterceptionResult<int>> SavingChangesAsync(
            DbContextEventData eventData,
            InterceptionResult<int> result,
            CancellationToken cancellationToken = default
        )
        {
            if (
                FailOutboxWrites
                && eventData
                    .Context!.ChangeTracker.Entries<EmailOutboxMessage>()
                    .Any(entry => entry.State == EntityState.Added)
            )
                throw new DbUpdateException("Simulated queue persistence failure");
            return ValueTask.FromResult(result);
        }
    }
}
