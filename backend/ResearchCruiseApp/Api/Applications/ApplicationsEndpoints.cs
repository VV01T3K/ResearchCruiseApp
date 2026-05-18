namespace ResearchCruiseApp.Api.Applications;

public static class ApplicationsEndpoints
{
    public static void Map(RouteGroupBuilder group)
    {
        Applications.Map(group);
        ApplicationCruise.Map(group);
        ApplicationEvaluation.Map(group);
        ApplicationDecision.Map(group);
        CruisePlanningApplications.Map(group);
        FormInitValues.Map(group);
        FormA.Map(group);
        FormB.Map(group);
        FormC.Map(group);
        SupervisorReview.Map(group);
    }
}
