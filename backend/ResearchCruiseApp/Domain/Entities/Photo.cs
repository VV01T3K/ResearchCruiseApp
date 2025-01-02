using System.ComponentModel.DataAnnotations;

namespace ResearchCruiseApp.Domain.Entities;


public class Photo : Entity
{
    [StringLength(1024)]
    public string Name { get; set; } = null!;

    public byte[] Content { get; set; } = [];
}