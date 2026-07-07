namespace ResearchCruiseApp.Api.Cruises;

public static class CruisesEndpoints
{
    public static void Map(RouteGroupBuilder group)
    {
        ListsEndpoints.Map(group);
        CruiseEndpoints.Map(group);
        LifecycleEndpoints.Map(group);
        PlanningEndpoints.Map(group);
        ExportEndpoints.Map(group);
    }
}
