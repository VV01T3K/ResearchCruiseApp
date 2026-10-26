using System.Diagnostics;
using System.Globalization;
using Microsoft.EntityFrameworkCore;
using ResearchCruiseApp.Domain;
using ResearchCruiseApp.Domain.Entities;
using ResearchCruiseApp.Infrastructure.Persistence;

namespace ResearchCruiseApp.Api.Applications.Shared;

internal class ApplicationScoringService(ApplicationDbContext dbContext)
{
    public static bool IsValidMinisterialPoints(string? value) =>
        int.TryParse(value, NumberStyles.None, CultureInfo.InvariantCulture, out var points)
        && points <= EvaluationConstants.MaxMinisterialPoints;

    public static bool IsValidAmount(string? value) =>
        double.TryParse(value, CultureInfo.InvariantCulture, out var amount)
        && amount is >= 0 and <= EvaluationConstants.MaxFinancingAmount;

    public async Task<Result> Evaluate(
        CruiseApplication cruiseApplication,
        bool isDraft,
        CancellationToken cancellationToken
    )
    {
        if (cruiseApplication.FormA is null)
            return Result.Empty;

        EvaluateResearchTasks(cruiseApplication);
        EvaluateContracts(cruiseApplication);
        EvaluateUgUnits(cruiseApplication);
        EvaluatePublications(cruiseApplication);
        EvaluateSpubTasks(cruiseApplication);

        if (GetPointsTotal(cruiseApplication.FormA) > int.MaxValue)
            return Error.InvalidArgument(
                "Suma punktów zgłoszenia przekracza zakres, który system może policzyć. "
                    + "Sprawdź punkty ministerialne publikacji i kwoty finansowania zadań."
            );

        return isDraft ? Result.Empty : await EvaluateEffects(cruiseApplication, cancellationToken);
    }

    public int GetPointsSum(CruiseApplication cruiseApplication)
    {
        return cruiseApplication.FormA is null
            ? 0
            : checked((int)GetPointsTotal(cruiseApplication.FormA));
    }

    private static long GetPointsTotal(FormA formA)
    {
        return formA.FormAResearchTasks.Sum(formAResearchTask => (long)formAResearchTask.Points)
            + formA.FormAContracts.Sum(formAContract => (long)formAContract.Points)
            + int.Parse(formA.UgUnitsPoints)
            + formA.FormAPublications.Sum(formAPublication => (long)formAPublication.Points)
            + formA.FormASpubTasks.Sum(formASpubTask => (long)formASpubTask.Points);
    }

    private static void EvaluateResearchTasks(CruiseApplication cruiseApplication)
    {
        Debug.Assert(cruiseApplication.FormA is not null);

        foreach (var formAResearchTask in cruiseApplication.FormA.FormAResearchTasks)
        {
            var researchTask = formAResearchTask.ResearchTask;

            formAResearchTask.Points = researchTask.Type switch
            {
                ResearchTaskType.BachelorThesis =>
                    EvaluationConstants.PointsForBachelorThesisResearchTask,

                ResearchTaskType.MasterThesis =>
                    EvaluationConstants.PointsForMasterThesisResearchTask,

                ResearchTaskType.DoctoralThesis =>
                    EvaluationConstants.PointsForDoctoralThesisResearchTask,

                ResearchTaskType.ProjectPreparation => researchTask.FinancingApproved?.ToBool()
                ?? false
                    ? EvaluationConstants.PointsForProjectPreparationWithFinancing
                    : EvaluationConstants.PointsForProjectPreparationWithoutFinancing,

                ResearchTaskType.DomesticProject
                    when !string.IsNullOrEmpty(researchTask.FinancingAmount) => checked(
                    EvaluationConstants.PointsPerDivisionForDomesticProject
                    * (int)(
                        double.Parse(researchTask.FinancingAmount, CultureInfo.InvariantCulture)
                        / EvaluationConstants.DomesticProjectDivision
                    )
                ),

                ResearchTaskType.ForeignProject
                    when !string.IsNullOrEmpty(researchTask.FinancingAmount) => checked(
                    EvaluationConstants.PointsPerDivisionForForeignProject
                    * (int)(
                        double.Parse(researchTask.FinancingAmount, CultureInfo.InvariantCulture)
                        / EvaluationConstants.ForeignProjectDivision
                    )
                ),

                ResearchTaskType.InternalUgProject =>
                    EvaluationConstants.PointsForInternalUgProject,

                ResearchTaskType.OwnResearchTask => EvaluationConstants.PointsForOwnResearchTask,

                _ => 0,
            };
        }
    }

    private static void EvaluateContracts(CruiseApplication cruiseApplication)
    {
        Debug.Assert(cruiseApplication.FormA is not null);

        foreach (var formAContract in cruiseApplication.FormA.FormAContracts)
        {
            var contract = formAContract.Contract;

            if (contract.Category == ContractCategory.Domestic)
                formAContract.Points = EvaluationConstants.PointsForDomesticContract;
            if (contract.Category == ContractCategory.International)
                formAContract.Points = EvaluationConstants.PointsForInternationalContract;
        }
    }

    private static void EvaluateUgUnits(CruiseApplication cruiseApplication)
    {
        Debug.Assert(cruiseApplication.FormA is not null);

        // Redundant since teams have been already validated on formA creation
        var notEmptyTeamsCount = cruiseApplication.FormA.FormAUgUnits.Count(formAUgUnit =>
            uint.Parse(formAUgUnit.NoOfEmployees) > 0 || uint.Parse(formAUgUnit.NoOfStudents) > 0
        );

        cruiseApplication.FormA.UgUnitsPoints = notEmptyTeamsCount switch
        {
            >= 3 => EvaluationConstants.PointsFor3OrMoreUgUnits.ToString(),
            2 => EvaluationConstants.PointsFor2UgUnits.ToString(),
            _ => 0.ToString(),
        };
    }

    private static void EvaluatePublications(CruiseApplication cruiseApplication)
    {
        Debug.Assert(cruiseApplication.FormA is not null);

        foreach (var formAPublication in cruiseApplication.FormA.FormAPublications)
        {
            var publication = formAPublication.Publication;

            double ministerialPointsRatio = 0;
            if (publication.Category == PublicationCategory.Subject)
                ministerialPointsRatio =
                    EvaluationConstants.MinisterialPointsRatioForSubjectPublication;
            if (publication.Category == PublicationCategory.Postscript)
                ministerialPointsRatio =
                    EvaluationConstants.MinisterialPointsRatioForPostscriptPublication;

            var ministerialPoints = string.IsNullOrEmpty(publication.MinisterialPoints)
                ? 0
                : int.Parse(publication.MinisterialPoints);
            formAPublication.Points = (int)(ministerialPoints * ministerialPointsRatio);
        }
    }

    private static void EvaluateSpubTasks(CruiseApplication cruiseApplication)
    {
        Debug.Assert(cruiseApplication.FormA is not null);

        foreach (var formASpubTask in cruiseApplication.FormA.FormASpubTasks)
        {
            formASpubTask.Points = EvaluationConstants.PointsForSpubTask;
        }
    }

    private async Task<Result> EvaluateEffects(
        CruiseApplication cruiseApplication,
        CancellationToken cancellationToken
    )
    {
        var effectsPoints = await dbContext
            .UserEffects.Where(userEffect =>
                userEffect.UserId == cruiseApplication.FormA!.CruiseManagerId
            )
            .SumAsync(userEffect => (long)userEffect.Points, cancellationToken);
        if (effectsPoints > int.MaxValue)
            return Error.InvalidArgument(
                "Suma punktów za efekty kierownika rejsu przekracza zakres, który system może policzyć."
            );

        cruiseApplication.EffectsPoints = (int)effectsPoints;
        return Result.Empty;
    }
}
