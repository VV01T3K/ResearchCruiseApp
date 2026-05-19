namespace ResearchCruiseApp.Api.Cruises;

public static class CruisesEndpoints
{
    public static void Map(RouteGroupBuilder group)
    {
        ListsEndpoints.Map(group);
        CruiseEndpoints.Map(group);
        Lifecycle.Map(group);
        PlanningEndpoints.Map(group);
        Export.Map(group);
    }
}
