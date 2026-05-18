namespace ResearchCruiseApp.Api.Applications.Contracts;

public class FormAPublicationDto
{
    public Guid Id { get; init; }

    public PublicationDto Publication { get; init; } = null!;

    public string Points { get; init; } = "0";
}
