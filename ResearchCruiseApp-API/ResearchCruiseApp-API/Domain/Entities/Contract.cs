using System.ComponentModel.DataAnnotations;

namespace ResearchCruiseApp_API.Domain.Entities;


public class Contract : Entity
{
      [StringLength(1024)]
      public string Category { get; set; } = null!;
      
      [MaxLength(1024)]
      public string InstitutionName { get; set; } = null!;
      
      [MaxLength(1024)] 
      public string InstitutionUnit { get; set; } = null!;
      
      [MaxLength(1024)]
      public string InstitutionLocalization { get; set; } = null!;
      
      [MaxLength(1024)]
      public string Description { get; set; } = null!;

      [MaxLength(1024)]
      public string ScanName { get; set; } = null!;

      public byte[] ScanContent { get; set; } = [];

      public List<FormAContract> FormAContracts { get; set; } = [];
}
