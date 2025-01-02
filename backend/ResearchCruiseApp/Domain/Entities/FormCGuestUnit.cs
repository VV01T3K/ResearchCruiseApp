using System.ComponentModel.DataAnnotations;

namespace ResearchCruiseApp.Domain.Entities;


public class FormCGuestUnit : Entity
{
    public FormC FormC { get; init; } = null!;

    public GuestUnit GuestUnit { get; set; } = null!;

    [StringLength(1024)]
    public string NoOfPersons { get; set; } = null!;
}