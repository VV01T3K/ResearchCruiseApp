using System.ComponentModel.DataAnnotations;
using System.Linq.Expressions;
using ResearchCruiseApp.Domain.Common.Enums;
using ResearchCruiseApp.Domain.Common.Interfaces;

namespace ResearchCruiseApp.Domain.Entities;

public class ResearchTask : Entity, IEquatable<ResearchTask>, IEquatableByExpression<ResearchTask>
{
    public ResearchTaskType Type { get; init; }

    [StringLength(1024)]
    public string? Title { get; init; }

    [StringLength(1024)]
    public string? Magazine { get; init; }

    [StringLength(1024)]
    public string? Author { get; init; }

    [StringLength(1024)]
    public string? Institution { get; init; }

    [StringLength(1024)]
    public string? Date { get; init; }

    [StringLength(1024)]
    public string? StartDate { get; init; }

    [StringLength(1024)]
    public string? EndDate { get; init; }

    [StringLength(1024)]
    public string? FinancingAmount { get; init; }

    [StringLength(10240)]
    public string? Description { get; init; }

    [StringLength(1024)]
    public string? FinancingApproved { get; init; } = "false";

    [StringLength(1024)]
    public string? SecuredAmount { get; set; }

    [StringLength(1024)]
    public string? MinisterialPoints { get; set; }

    public List<FormAResearchTask> FormAResearchTasks { get; set; } = [];

    public List<ResearchTaskEffect> ResearchTasksEffects { get; set; } = [];

    public override bool Equals(object? other) => Equals((ResearchTask?)other);

    public override int GetHashCode()
    {
        return HashCode.Combine(
            Type,
            Title,
            Magazine,
            Author,
            Institution,
            Date,
            StartDate,
            HashCode.Combine(
                EndDate,
                FinancingAmount,
                Description,
                FinancingApproved,
                SecuredAmount,
                MinisterialPoints
            )
        );
    }

    public bool Equals(ResearchTask? other)
    {
        return other is not null
            && other.Type == Type
            && other.Title == Title
            && other.Magazine == Magazine
            && other.Author == Author
            && other.Institution == Institution
            && other.Date == Date
            && other.StartDate == StartDate
            && other.EndDate == EndDate
            && other.FinancingAmount == FinancingAmount
            && other.Description == Description
            && other.FinancingApproved == FinancingApproved
            && other.SecuredAmount == SecuredAmount
            && other.MinisterialPoints == MinisterialPoints;
    }

    public static Expression<Func<ResearchTask, bool>> EqualsByExpression(ResearchTask? other)
    {
        return researchTask =>
            other != null
            && other.Type == researchTask.Type
            && other.Title == researchTask.Title
            && other.Magazine == researchTask.Magazine
            && other.Author == researchTask.Author
            && other.Institution == researchTask.Institution
            && other.Date == researchTask.Date
            && other.StartDate == researchTask.StartDate
            && other.EndDate == researchTask.EndDate
            && other.FinancingAmount == researchTask.FinancingAmount
            && other.Description == researchTask.Description
            && other.FinancingApproved == researchTask.FinancingApproved
            && other.SecuredAmount == researchTask.SecuredAmount
            && other.MinisterialPoints == researchTask.MinisterialPoints;
    }
}
