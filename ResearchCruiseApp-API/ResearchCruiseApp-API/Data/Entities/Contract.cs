using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ResearchCruiseApp_API.Data;

public class Contract
{
      [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
      public Guid Id { get; set; }

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
      
      public byte[] ScanContentCompressed { get; set; } = [];
}