using System.ComponentModel.DataAnnotations;
using System.Linq.Expressions;
using ResearchCruiseApp.Domain.Common.Interfaces;

namespace ResearchCruiseApp.Domain.Entities;


public class Publication : Entity, IEquatable<Publication>, IEquatableByExpression<Publication>
{
    [StringLength(1024)]
    public string Category { get; init; } = null!;
    
    [StringLength(1024)]
    public string Doi { get; init; } = null!;
    
    [StringLength(1024)]
    public string Authors { get; init; } = null!;
    
    [StringLength(1024)]
    public string Title { get; init; } = null!;
    
    [StringLength(1024)]
    public string Magazine { get; init; } = null!;

    [StringLength(1024)]
    public string Year { get; init; } = null!;

    [StringLength(1024)]
    public string MinisterialPoints { get; init; } = null!;
    
    public List<FormAPublication> FormAPublications { get; init; } = [];

    public List<UserPublication> UserPublications { get; init; } = [];

    
    public override bool Equals(object? other) =>
        Equals((Publication?)other);

    public override int GetHashCode()
    {
        return Category.GetHashCode() +
               Doi.GetHashCode() +
               Authors.GetHashCode() +
               Title.GetHashCode() +
               Magazine.GetHashCode() +
               Year.GetHashCode() +
               MinisterialPoints.GetHashCode();
    }
    
    public bool Equals(Publication? other)
    {
        return other is not null &&
               other.Category == Category &&
               other.Doi == Doi &&
               other.Authors == Authors &&
               other.Title == Title &&
               other.Magazine == Magazine &&
               other.Year == Year &&
               other.MinisterialPoints == MinisterialPoints;
    }

    public static Expression<Func<Publication, bool>> EqualsByExpression(Publication? other)
    {
        return publication =>
            other != null &&
            other.Category == publication.Category &&
            other.Doi == publication.Doi &&
            other.Authors == publication.Authors &&
            other.Title == publication.Title &&
            other.Magazine == publication.Magazine &&
            other.Year == publication.Year &&
            other.MinisterialPoints == publication.MinisterialPoints;
    }
}