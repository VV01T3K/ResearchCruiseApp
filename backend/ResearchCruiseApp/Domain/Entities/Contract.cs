using System.ComponentModel.DataAnnotations;
using System.Linq.Expressions;
using ResearchCruiseApp.Domain.Common.Interfaces;

namespace ResearchCruiseApp.Domain.Entities;

public class Contract : Entity, IEquatable<Contract>, IEquatableByExpression<Contract>
{
    private string? _scanName;
    private byte[]? _scanContent;

    [StringLength(1024)]
    public string Category { get; init; } = null!;

    [StringLength(1024)]
    public string InstitutionName { get; init; } = null!;

    [StringLength(1024)]
    public string InstitutionUnit { get; init; } = null!;

    [StringLength(1024)]
    public string InstitutionLocalization { get; init; } = null!;

    [StringLength(1024)]
    public string Description { get; init; } = null!;

    [StringLength(1024)]
    public string ScanName
    {
        get => _scanName ?? throw new InvalidOperationException("ScanName has not been set.");
        set
        {
            if (_scanName is not null)
                throw new InvalidOperationException("ScanName can only be set once.");
            _scanName = value;
        }
    }

    public byte[] ScanContent
    {
        get => _scanContent ?? throw new InvalidOperationException("ScanContent has not been set.");
        set
        {
            if (_scanContent is not null)
                throw new InvalidOperationException("ScanContent can only be set once.");
            _scanContent = value;
        }
    }

    public List<FormAContract> FormAContracts { get; init; } = [];

    public List<FormC> FormsC { get; init; } = [];

    public override bool Equals(object? other) => Equals((Contract?)other);

    public override int GetHashCode()
    {
        return Category.GetHashCode()
            + InstitutionName.GetHashCode()
            + InstitutionUnit.GetHashCode()
            + InstitutionLocalization.GetHashCode()
            + Description.GetHashCode()
            + ScanName.GetHashCode()
            + ScanContent.GetHashCode();
    }

    public bool Equals(Contract? other)
    {
        return other is not null
            && other.Category == Category
            && other.InstitutionName == InstitutionName
            && other.InstitutionUnit == InstitutionUnit
            && other.InstitutionLocalization == InstitutionLocalization
            && other.Description == Description
            && other.ScanName == ScanName
            && other.ScanContent.SequenceEqual(ScanContent);
    }

    public static Expression<Func<Contract, bool>> EqualsByExpression(Contract? other)
    {
        return contract =>
            other != null
            && other.Category == contract.Category
            && other.InstitutionName == contract.InstitutionName
            && other.InstitutionUnit == contract.InstitutionUnit
            && other.InstitutionLocalization == contract.InstitutionLocalization
            && other.Description == contract.Description
            && other.ScanName == contract.ScanName
            && other.ScanContent.SequenceEqual(contract.ScanContent);
    }
}
