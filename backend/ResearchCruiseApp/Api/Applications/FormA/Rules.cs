namespace ResearchCruiseApp.Api.Applications;

public static class CruiseBlockadeRules
{
    public static bool HasNoFreeWindow(
        DateTime start,
        DateTime end,
        double requiredDurationDays,
        IEnumerable<(DateTime Start, DateTime End)> blockades
    )
    {
        if ((end - start).TotalDays < requiredDurationDays)
            return true;

        var overlappingBlockades = blockades
            .Where(blockade => blockade.End > start && blockade.Start < end)
            .Select(blockade => new
            {
                Start = blockade.Start < start ? start : blockade.Start,
                End = blockade.End > end ? end : blockade.End,
            })
            .OrderBy(blockade => blockade.Start)
            .ToList();

        if (overlappingBlockades.Count == 0)
            return false;

        var mergedBlockades = new List<(DateTime Start, DateTime End)>();
        foreach (var blockade in overlappingBlockades)
        {
            if (mergedBlockades.Count == 0)
            {
                mergedBlockades.Add((blockade.Start, blockade.End));
                continue;
            }

            var last = mergedBlockades[^1];
            if (blockade.Start <= last.End)
            {
                mergedBlockades[^1] = (
                    last.Start,
                    blockade.End > last.End ? blockade.End : last.End
                );
            }
            else
            {
                mergedBlockades.Add((blockade.Start, blockade.End));
            }
        }

        var freeSlotStart = start;
        foreach (var blockade in mergedBlockades)
        {
            if ((blockade.Start - freeSlotStart).TotalDays >= requiredDurationDays)
                return false;

            if (blockade.End > freeSlotStart)
                freeSlotStart = blockade.End;
        }

        return (end - freeSlotStart).TotalDays < requiredDurationDays;
    }
}
