using System.Net.Http.Headers;
using ResearchCruiseApp.Domain;
using ResearchCruiseApp.Domain.Entities;
using ResearchCruiseApp.IntegrationTests.Auth;

namespace ResearchCruiseApp.IntegrationTests.Infrastructure;

internal static class TestApplications
{
    internal static async Task<(Guid Id, string OwnerEmail)> Create(
        TestApplication app,
        CruiseApplicationStatus status
    )
    {
        var owner = await TestUsers.Create(
            app,
            "workflow-owner@example.invalid",
            RoleName.CruiseManager
        );
        var application = new CruiseApplication
        {
            Date = new DateOnly(2030, 1, 15),
            Status = status,
            FormA = new FormA
            {
                CruiseManagerId = Guid.Parse(owner.Id),
                Year = "2030",
                CruiseHours = "24",
                PeriodNotes = "",
                DifferentUsage = "",
                CruiseGoalDescription = "",
                SupervisorEmail = "supervisor@example.invalid",
            },
        };
        await app.InDatabase(async db =>
        {
            db.CruiseApplications.Add(application);
            await db.SaveChangesAsync(TestContext.Current.CancellationToken);
        });
        return (application.Id, owner.Email!);
    }

    internal static async Task<HttpClient> Login(TestApplication app, string email)
    {
        var client = app.CreateApiClient();
        try
        {
            var session = await RefreshSessionTests.Login(client, email);
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(
                "Bearer",
                session.Access
            );
            return client;
        }
        catch
        {
            client.Dispose();
            throw;
        }
    }
}
