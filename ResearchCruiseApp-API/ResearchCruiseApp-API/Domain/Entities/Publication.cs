using System.ComponentModel.DataAnnotations;

namespace ResearchCruiseApp_API.Domain.Entities;


public class Publication: Entity
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
    
    public int Year { get; init; }

    public int MinisterialPoints { get; init; }
    
    public List<FormAPublication> FormAPublications { get; init; } = [];


    public override bool Equals(object? other)
    {
        if (other is null)
            return false;

        var otherPublication = (Publication)other;

        return otherPublication.Category == Category &&
               otherPublication.Doi == Doi &&
               otherPublication.Authors == Authors &&
               otherPublication.Title == Title &&
               otherPublication.Magazine == Magazine &&
               otherPublication.Year == Year &&
               otherPublication.MinisterialPoints == MinisterialPoints;
    }

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
}