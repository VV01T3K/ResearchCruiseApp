using System.ComponentModel.DataAnnotations;
using System.Linq.Expressions;
using ResearchCruiseApp_API.Domain.Common.Interfaces;

namespace ResearchCruiseApp_API.Domain.Entities;


public class Permission : Entity, IEquatable<Permission>, IEquatableByExpression<Permission>
{
    private string? _scanName;
    private byte[]? _scanContent = [];
    
    [StringLength(1024)]
    public string Description { get; init; } = null!;

    [StringLength(1024)]
    public string Executive { get; init; } = null!;
    
    [MaxLength(1024)]  
    public string? ScanName
    {
        get => _scanName;
        set
        {
            if (_scanName is not null)
                throw new InvalidOperationException("ScanName can only be set once.");
            _scanName = value;
        }
    }
    
    public byte[]? ScanContent
    {
        get => _scanContent;
        set
        {
            if (_scanContent is not null)
                throw new InvalidOperationException("ScanContent can only be set once.");
            _scanContent = value;
        }
    }
    
    public List<FormA> FormsA { get; init; } = [];
    
    public List<FormB> FormsB { get; init; } = [];
    
    public List<FormC> FormsC { get; init; } = [];

    
    public override bool Equals(object? other) =>
        Equals((Permission?)other);
    
    public override int GetHashCode()
    {
        return Description.GetHashCode() +
               Executive.GetHashCode() +
               ScanName?.GetHashCode() ?? 0 +
               ScanContent?.GetHashCode() ?? 0;
    }
    
    public bool Equals(Permission? other)
    {
        return other is not null &&
               other.Description == Description &&
               other.Executive == Executive &&
               other.ScanName == ScanName &&
               other.ScanContent.SequenceEqual(ScanContent);
    }

    public static Expression<Func<Permission, bool>> EqualsByExpression(Permission? other)
    {
        return permission =>
            other != null &&
            other.Description == permission.Description &&
            other.Executive == permission.Executive &&
            other.ScanName == permission.ScanName &&
            other.ScanContent.SequenceEqual(permission.ScanContent);
    }
}