using System.ComponentModel.DataAnnotations;
using System.Linq.Expressions;
using ResearchCruiseApp.Domain.Common.Interfaces;

namespace ResearchCruiseApp.Domain.Entities;

public class Contract : Entity, IEquatable<Contract>, IEquatableByExpression<Contract>
{
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

    public List<ContractFile> Files { get; init; } = [];

    public List<FormAContract> FormAContracts { get; init; } = [];

    public List<FormC> FormsC { get; init; } = [];

    public override bool Equals(object? other) => Equals((Contract?)other);

    public override int GetHashCode()
    {
        var hashCode =
            Category.GetHashCode()
            + InstitutionName.GetHashCode()
            + InstitutionUnit.GetHashCode()
            + InstitutionLocalization.GetHashCode()
            + Description.GetHashCode();

        foreach (var file in Files)
        {
            hashCode += file.FileName!.GetHashCode() + file.FileContent!.GetHashCode();
        }

        return hashCode;
    }

    public bool Equals(Contract? other)
    {
        if (other is null)
            return false;

        var basicPropertiesMatch =
            other.Category == Category
            && other.InstitutionName == InstitutionName
            && other.InstitutionUnit == InstitutionUnit
            && other.InstitutionLocalization == InstitutionLocalization
            && other.Description == Description;

        if (!basicPropertiesMatch)
            return false;

        if (Files.Count != other.Files.Count)
            return false;

        var sortedFiles = Files.OrderBy(f => f.FileName).ToList();
        var otherSortedFiles = other.Files.OrderBy(f => f.FileName).ToList();

        for (int i = 0; i < sortedFiles.Count; i++)
        {
            var firstFile = sortedFiles[i];
            var secondFile = otherSortedFiles[i];
            if (firstFile.FileName != secondFile.FileName)
                return false;
            if (firstFile.FileContent is null || secondFile.FileContent is null)
                return false;
            if (!firstFile.FileContent.SequenceEqual(secondFile.FileContent))
                return false;
        }

        return true;
    }

    public static Expression<Func<Contract, bool>> EqualsByExpression(Contract? other)
    {
        return contract =>
            other != null
            && other.Category == contract.Category
            && other.InstitutionName == contract.InstitutionName
            && other.InstitutionUnit == contract.InstitutionUnit
            && other.InstitutionLocalization == contract.InstitutionLocalization
            && other.Description == contract.Description;
    }
}
