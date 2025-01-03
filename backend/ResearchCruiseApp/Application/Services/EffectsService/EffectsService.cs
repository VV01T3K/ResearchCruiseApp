using System.Diagnostics;
using ResearchCruiseApp.Application.Common.Extensions;
using ResearchCruiseApp.Application.ExternalServices.Persistence.Repositories;
using ResearchCruiseApp.Application.Models.DTOs.CruiseApplications;
using ResearchCruiseApp.Application.Services.FormsFieldsService;
using ResearchCruiseApp.Domain.Common.Constants;
using ResearchCruiseApp.Domain.Common.Enums;
using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Application.Services.EffectsService;

public class EffectsService(
    IResearchTasksRepository researchTasksRepository,
    IResearchTaskEffectsRepository researchTaskEffectsRepository,
    IUserEffectsRepository userEffectsRepository,
    IFormsFieldsService formsFieldsService
) : IEffectsService
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
            researchTaskEffectsRepository.Delete(researchTaskEffect);

            foreach (var userEffect in researchTaskEffect.UserEffects)
            {
                userEffectsRepository.Delete(userEffect);
            }

            if (
                await researchTasksRepository.CountFormAResearchTasks(
                    researchTask,
                    cancellationToken
                ) == 0
                && await researchTasksRepository.CountUniqueFormsC(researchTask, cancellationToken)
                    == 1
            ) // The given one
            {
                researchTasksRepository.Delete(researchTask);
            }
        }
    }

    public async Task AddResearchTasksEffects(
        FormC formC,
        List<ResearchTaskEffectDto> researchTaskEffectDtos,
        CancellationToken cancellationToken
    )
    {
        var alreadyAddedResearchTasks = new HashSet<ResearchTask>();

        foreach (var researchTaskEffectDto in researchTaskEffectDtos)
        {
            var researchTask = await formsFieldsService.GetUniqueResearchTask(
                researchTaskEffectDto,
                alreadyAddedResearchTasks,
                cancellationToken
            );
            alreadyAddedResearchTasks.Add(researchTask);

            var researchTaskEffect = new ResearchTaskEffect
            {
                ResearchTask = researchTask,
                Done = researchTaskEffectDto.Done,
                PublicationMinisterialPoints = researchTaskEffectDto.PublicationMinisterialPoints,
                ManagerConditionMet = researchTaskEffectDto.ManagerConditionMet,
                DeputyConditionMet = researchTaskEffectDto.DeputyConditionMet,
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

        return userEffectsRepository.Add(userEffect, cancellationToken);
    }
}
