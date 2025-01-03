namespace ResearchCruiseApp.Application.Models.Interfaces;

public interface IResearchTaskDto
{
    string Type { get; init; }

    string? Title { get; init; }

    string? Magazine { get; init; }

    string? Author { get; init; }

    string? Institution { get; init; }

    string? Date { get; init; }

    string? StartDate { get; init; }

    string? EndDate { get; init; }

    string? FinancingAmount { get; init; }

    string? FinancingApproved { get; init; }

    string? Description { get; init; }

    string? SecuredAmount { get; init; }

    string? MinisterialPoints { get; init; }
}
