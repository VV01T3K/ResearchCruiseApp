namespace ResearchCruiseApp.Api.Applications;

public static class ApplicationsEndpoints
{
    public static void Map(RouteGroupBuilder group)
    {
        CatalogEndpoints.Map(group);
        ApplicationCruiseEndpoints.Map(group);
        EvaluationEndpoints.Map(group);
        ApplicationDecisionEndpoints.Map(group);
        CruisePlanningEndpoints.Map(group);
        FormContextEndpoints.Map(group);
        FormAEndpoints.Map(group);
        FormBEndpoints.Map(group);
        FormCEndpoints.Map(group);
        SupervisorReviewEndpoints.Map(group);
    }
}
