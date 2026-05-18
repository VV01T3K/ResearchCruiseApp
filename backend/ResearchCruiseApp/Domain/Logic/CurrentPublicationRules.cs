namespace ResearchCruiseApp.Domain.Logic;

public static class CurrentPublicationRules
{
    public static bool ShouldDeletePublication(int formAReferences, int userReferences)
    {
        return formAReferences == 0 && userReferences == 1;
    }
}
