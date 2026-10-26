using Microsoft.EntityFrameworkCore;
using ResearchCruiseApp.Domain;
using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Infrastructure.Persistence;

internal class YearBasedKeyGenerator(ApplicationDbContext dbContext)
{
    public async Task<string> GenerateKey<T>(
        IQueryable<T> entities,
        CancellationToken cancellationToken
    )
        where T : Entity, IYearBasedNumbered =>
        (await GenerateKeys(entities, 1, cancellationToken))[0];

    public async Task<List<string>> GenerateKeys<T>(
        IQueryable<T> entities,
        int count,
        CancellationToken cancellationToken
    )
        where T : Entity, IYearBasedNumbered
    {
        await Lock<T>(cancellationToken);
        var currentYear = DateTime.Now.Year.ToString();
        var ordinalNumberStartIdx = currentYear.Length + 1;
        var existingEntities = await entities.ToListAsync(cancellationToken);
        var maxCurrentYearOrdinalNumber =
            existingEntities
                .Where(e => e.Number.StartsWith(currentYear))
                .MaxBy(e => int.Parse(e.Number[ordinalNumberStartIdx..]))
                ?.Number[ordinalNumberStartIdx..]
            ?? "0";

        return Enumerable
            .Range(int.Parse(maxCurrentYearOrdinalNumber) + 1, count)
            .Select(ordinalNumber => $"{currentYear}/{ordinalNumber}")
            .ToList();
    }

    // Held until the caller's transaction ends, so allocation and insert are serialized.
    public async Task Lock<T>(CancellationToken cancellationToken)
        where T : Entity, IYearBasedNumbered
    {
        var resource = $"{typeof(T).Name}.Number";
        await dbContext.Database.ExecuteSqlAsync(
            $"""
            DECLARE @result int;
            EXEC @result = sp_getapplock @Resource = {resource}, @LockMode = 'Exclusive', @LockOwner = 'Transaction';
            IF @result < 0 THROW 50000, 'Could not lock year-based numbering.', 1;
            """,
            cancellationToken
        );
    }
}
