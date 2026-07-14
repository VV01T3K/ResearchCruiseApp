using System.Diagnostics;
using Microsoft.EntityFrameworkCore;
using ResearchCruiseApp.Api.Applications.Shared;
using ResearchCruiseApp.Domain;
using ResearchCruiseApp.Domain.Entities;
using ResearchCruiseApp.Infrastructure.Persistence;

namespace ResearchCruiseApp.Api.Applications;

internal class CruiseEffectService(
    ApplicationDbContext dbContext,
    UniqueFormFieldResolver formsFieldsService
)
{
    public async Task EvaluateEffects(
        CruiseApplication cruiseApplication,
        CancellationToken cancellationToken
    )
    {
        if (cruiseApplication.FormA is null)
            throw new ArgumentException(
                "CruiseApplication must have a FormA for its effects to be evaluated"
            );

        if (cruiseApplication.FormC is null)
            return;

        var cruiseManagerId = cruiseApplication.FormA.CruiseManagerId;
        var deputyManagerId = cruiseApplication.FormA.DeputyManagerId;

        foreach (var effect in cruiseApplication.FormC.ResearchTaskEffects)
        {
            var pointsForManagersTeam = GetPointsForManagersTeam(effect, cruiseApplication);

            await AddEvaluationForUser(
                effect,
                cruiseManagerId,
                pointsForManagersTeam[CruiseFunction.CruiseManager],
                cancellationToken
            );
            await AddEvaluationForUser(
                effect,
                deputyManagerId,
                pointsForManagersTeam[CruiseFunction.DeputyManager],
                cancellationToken
            );
        }
    }

    public async Task DeleteResearchTasksEffects(FormC formC, CancellationToken cancellationToken)
    {
        foreach (var researchTaskEffect in formC.ResearchTaskEffects)
        {
            var researchTask = researchTaskEffect.ResearchTask;
            dbContext.ResearchTaskEffects.Remove(researchTaskEffect);

            foreach (var userEffect in researchTaskEffect.UserEffects)
            {
                dbContext.UserEffects.Remove(userEffect);
            }

            if (
                !await dbContext
                    .ResearchTasks.Where(candidate => candidate.Id == researchTask.Id)
                    .SelectMany(candidate => candidate.FormAResearchTasks)
                    .AnyAsync(cancellationToken)
                && await dbContext
                    .ResearchTasks.Where(candidate => candidate.Id == researchTask.Id)
                    .SelectMany(candidate => candidate.ResearchTasksEffects)
                    .Select(effect => effect.FormC.Id)
                    .Distinct()
                    .CountAsync(cancellationToken) == 1
            ) // The given one
            {
                dbContext.ResearchTasks.Remove(researchTask);
            }
        }
    }

    public async Task AddResearchTasksEffects(
        FormC formC,
        List<ResearchTaskEffectFields> researchTaskEffects,
        CancellationToken cancellationToken
    )
    {
        var alreadyAddedResearchTasks = new HashSet<ResearchTask>();

        foreach (var effectFields in researchTaskEffects)
        {
            var researchTask = await formsFieldsService.GetUniqueResearchTask(
                effectFields,
                alreadyAddedResearchTasks,
                cancellationToken
            );
            alreadyAddedResearchTasks.Add(researchTask);

            var researchTaskEffect = new ResearchTaskEffect
            {
                ResearchTask = researchTask,
                Done = effectFields.Done,
                PublicationMinisterialPoints = effectFields.PublicationMinisterialPoints,
                ManagerConditionMet = effectFields.ManagerConditionMet,
                DeputyConditionMet = effectFields.DeputyConditionMet,
            };
            formC.ResearchTaskEffects.Add(researchTaskEffect);
        }
    }

    private static Dictionary<CruiseFunction, int> GetPointsForManagersTeam(
        ResearchTaskEffect effect,
        CruiseApplication cruiseApplication
    )
    {
        var managerPoints = 0;
        var deputyPoints = 0;

        if (!effect.Done.ToBool())
        {
            return new Dictionary<CruiseFunction, int>
            {
                { CruiseFunction.CruiseManager, managerPoints },
                { CruiseFunction.DeputyManager, deputyPoints },
            };
        }

        var managerConditionMet = effect.ManagerConditionMet.ToBool();
        var deputyConditionMet = effect.DeputyConditionMet.ToBool();

        switch (effect.ResearchTask.Type)
        {
            case ResearchTaskType.BachelorThesis:
                managerPoints = managerConditionMet
                    ? EvaluationConstants.PointsForBachelorThesisEffect
                    : 0;
                deputyPoints = deputyConditionMet
                    ? EvaluationConstants.PointsForBachelorThesisEffect
                    : 0;
                break;

            case ResearchTaskType.MasterThesis:
                managerPoints = managerConditionMet
                    ? EvaluationConstants.PointsForMasterThesisEffect
                    : 0;
                deputyPoints = deputyConditionMet
                    ? EvaluationConstants.PointsForMasterThesisEffect
                    : 0;
                break;

            case ResearchTaskType.DoctoralThesis:
                managerPoints = managerConditionMet
                    ? EvaluationConstants.PointsForDoctoralThesisEffect
                    : 0;
                deputyPoints = deputyConditionMet
                    ? EvaluationConstants.PointsForDoctoralThesisEffect
                    : 0;
                break;

            case ResearchTaskType.ProjectPreparation:
                var supplementaryConditionMet = CheckSupplementaryCondition(effect);
                managerPoints =
                    supplementaryConditionMet || managerConditionMet
                        ? EvaluationConstants.PointsForProjectPreparationEffect
                        : 0;
                deputyPoints = supplementaryConditionMet
                    ? EvaluationConstants.PointsForProjectPreparationEffect
                    : 0;
                break;

            case ResearchTaskType.DomesticProject:
            case ResearchTaskType.ForeignProject:
            case ResearchTaskType.InternalUgProject:
            case ResearchTaskType.OtherProject:
            case ResearchTaskType.OwnResearchTask:
                var publicationMinisterialPoints = int.Parse(
                    effect.PublicationMinisterialPoints ?? "0"
                );
                managerPoints = publicationMinisterialPoints / 2;
                deputyPoints = publicationMinisterialPoints / 2;
                break;

            case ResearchTaskType.OtherResearchTask:
                var evaluationBeforeCruise = GetResearchTaskEvaluationBeforeCruise(
                    effect,
                    cruiseApplication
                );
                managerPoints = evaluationBeforeCruise;
                deputyPoints = evaluationBeforeCruise;
                break;
        }

        return new Dictionary<CruiseFunction, int>
        {
            { CruiseFunction.CruiseManager, managerPoints },
            { CruiseFunction.DeputyManager, deputyPoints },
        };
    }

    private static bool CheckSupplementaryCondition(ResearchTaskEffect effect)
    {
        switch (effect.ResearchTask.Type)
        {
            case ResearchTaskType.ProjectPreparation:
                int? publicationPoints = effect.PublicationMinisterialPoints is null
                    ? null
                    : int.Parse(effect.PublicationMinisterialPoints);
                return publicationPoints
                    >= EvaluationConstants.ProjectPreparationPublicationMinisterialPointsThreshold;

            default:
                return false;
        }
    }

    /// <summary>
    /// Returns the number of points that have been assigned to the researchTask linked with the given effect when
    /// the cruiseApplication was evaluated before the cruise
    /// </summary>
    private static int GetResearchTaskEvaluationBeforeCruise(
        ResearchTaskEffect effect,
        CruiseApplication cruiseApplication
    )
    {
        Debug.Assert(cruiseApplication.FormA is not null);

        return cruiseApplication
            .FormA.FormAResearchTasks.Where(formAResearchTask =>
                formAResearchTask.ResearchTask.Id == effect.ResearchTask.Id
            )
            .Select(formAResearchTask => formAResearchTask.Points)
            .SingleOrDefault();
    }

    private Task AddEvaluationForUser(
        ResearchTaskEffect effect,
        Guid userId,
        int points,
        CancellationToken cancellationToken
    )
    {
        var userEffect = new UserEffect
        {
            UserId = userId,
            Effect = effect,
            Points = points,
        };

        return dbContext.UserEffects.AddAsync(userEffect, cancellationToken).AsTask();
    }
}
