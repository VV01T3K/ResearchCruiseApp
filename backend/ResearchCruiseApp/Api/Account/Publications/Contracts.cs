using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Api.Account;

public sealed record ImportPublicationRequest(
    string Category,
    string? Doi,
    string? Authors,
    string? Title,
    string? Magazine,
    string? Year,
    string MinisterialPoints
)
{
    public Publication ToEntity()
    {
        return new Publication
        {
            Category = Category,
            Doi = Doi,
            Authors = Authors,
            Title = Title,
            Magazine = Magazine,
            Year = Year,
            MinisterialPoints = MinisterialPoints,
        };
    }
}

public sealed record DeletePublicationRequest(Guid PublicationId);

public sealed record PublicationResponse(
    Guid Id,
    string Category,
    string? Doi,
    string? Authors,
    string? Title,
    string? Magazine,
    string? Year,
    string MinisterialPoints
)
{
    public static PublicationResponse From(Publication publication)
    {
        return new PublicationResponse(
            publication.Id,
            publication.Category,
            publication.Doi,
            publication.Authors,
            publication.Title,
            publication.Magazine,
            publication.Year,
            publication.MinisterialPoints
        );
    }
}
