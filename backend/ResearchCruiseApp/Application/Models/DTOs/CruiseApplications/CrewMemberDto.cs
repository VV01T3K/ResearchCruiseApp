using System.ComponentModel.DataAnnotations;

namespace ResearchCruiseApp.Application.Models.DTOs.CruiseApplications;


public class CrewMemberDto
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
}