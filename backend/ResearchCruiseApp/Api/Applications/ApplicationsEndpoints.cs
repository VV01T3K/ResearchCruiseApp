namespace ResearchCruiseApp.Api.Applications;

public static class ApplicationsEndpoints
{
    public static void Map(RouteGroupBuilder group)
    {
        Applications.Map(group);
        ApplicationCruiseEndpoints.Map(group);
        ApplicationEvaluation.Map(group);
        ApplicationDecisionEndpoints.Map(group);
        CruisePlanningApplications.Map(group);
        FormContext.Map(group);
        FormAEndpoints.Map(group);
        FormBEndpoints.Map(group);
        FormCEndpoints.Map(group);
        SupervisorReviewEndpoints.Map(group);
    }
}
