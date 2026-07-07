using System.Linq.Expressions;
using ResearchCruiseApp.Domain;

namespace ResearchCruiseApp.Domain.Entities;

public class Publication : Entity, IEquatable<Publication>, IEquatableByExpression<Publication>
{
    public string Category { get; init; } = null!;
    public string? Doi { get; init; }
    public string? Authors { get; init; }
    public string? Title { get; init; }
    public string? Magazine { get; init; }
    public string? Year { get; init; }
    public string MinisterialPoints { get; init; } = null!;

    public List<FormAPublication> FormAPublications { get; init; } = [];

    public List<UserPublication> UserPublications { get; init; } = [];

    public override bool Equals(object? other) => Equals((Publication?)other);

    public override int GetHashCode()
    {
        return HashCode.Combine(Category, Doi, Authors, Title, Magazine, Year, MinisterialPoints);
    }

    public bool Equals(Publication? other)
    {
        return other is not null
            && other.Category == Category
            && other.Doi == Doi
            && other.Authors == Authors
            && other.Title == Title
            && other.Magazine == Magazine
            && other.Year == Year
            && other.MinisterialPoints == MinisterialPoints;
    }

    public static Expression<Func<Publication, bool>> EqualsByExpression(Publication? other)
    {
        return publication =>
            other != null
            && other.Category == publication.Category
            && other.Doi == publication.Doi
            && other.Authors == publication.Authors
            && other.Title == publication.Title
            && other.Magazine == publication.Magazine
            && other.Year == publication.Year
            && other.MinisterialPoints == publication.MinisterialPoints;
    }
}
