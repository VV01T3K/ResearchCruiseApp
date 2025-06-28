using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace ResearchCruiseApp.Domain.Entities;

[Index(nameof(ContractId))]
public class ContractFile : Entity
{
    [StringLength(1024)]
    public string? FileName { get; set; }

    public byte[]? FileContent { get; set; }

    [ForeignKey(nameof(Contract))]
    public Guid ContractId { get; init; }

    public Contract? Contract { get; init; }
}
