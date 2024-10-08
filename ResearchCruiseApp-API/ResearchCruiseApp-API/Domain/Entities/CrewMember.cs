using System.ComponentModel.DataAnnotations;

namespace ResearchCruiseApp_API.Domain.Entities;


public class CrewMember : Entity
{
    [StringLength(1024)]
    public string Title { get; init; } = null!;
    
    [StringLength(1024)]
    public string FirstName { get; init; } = null!;
    
    [StringLength(1024)]
    public string LastName { get; init; } = null!;
    
    [StringLength(1024)]
    public string BirthPlace { get; init; } = null!;
    
    [StringLength(1024)]
    public string BirthDate { get; init; } = null!;
    
    [StringLength(1024)]
    public string DocumentNumber { get; init; } = null!;
    
    [StringLength(1024)]
    public string DocumentExpiryDate { get; init; } = null!;
    
    [StringLength(1024)]
    public string Institution { get; init; } = null!;

    public List<FormB> FormsB { get; set; } = [];


    public override bool Equals(object? other)
    {
        if (other is not CrewMember otherCrewMember)
            return false;
        
        return otherCrewMember.Title == Title &&
               otherCrewMember.FirstName == FirstName &&
               otherCrewMember.LastName == LastName &&
               otherCrewMember.BirthPlace == BirthPlace &&
               otherCrewMember.BirthDate == BirthDate &&
               otherCrewMember.DocumentNumber == DocumentNumber &&
               otherCrewMember.DocumentExpiryDate == DocumentExpiryDate &&
               otherCrewMember.Institution == Institution;
    }

    public override int GetHashCode()
    {
        return Title.GetHashCode() +
               FirstName.GetHashCode() +
               LastName.GetHashCode() +
               BirthPlace.GetHashCode() +
               BirthDate.GetHashCode() +
               DocumentNumber.GetHashCode() +
               DocumentExpiryDate.GetHashCode() +
               Institution.GetHashCode();
    }
}