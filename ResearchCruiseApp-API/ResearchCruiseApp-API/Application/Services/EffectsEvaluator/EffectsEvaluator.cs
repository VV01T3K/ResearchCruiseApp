using System.Diagnostics;
using ResearchCruiseApp_API.Application.Common.Constants;
using ResearchCruiseApp_API.Application.ExternalServices.Persistence.Repositories;
using ResearchCruiseApp_API.Domain.Common.Enums;
using ResearchCruiseApp_API.Domain.Common.Extensions;
using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Application.Services.EffectsEvaluator;


public class EffectsEvaluator(IUserEffectsRepository userEffectsRepository) : IEffectsEvaluator
{
    public async Task Evaluate(CruiseApplication cruiseApplication, CancellationToken cancellationToken)
    {
        if (cruiseApplication.FormA is null)
            throw new ArgumentException("CruiseApplication must have a FormA for its effects to be evaluated");
        
        if (cruiseApplication.FormC is null)
            return;
        
        var cruiseManagerId = cruiseApplication.FormA.CruiseManagerId;
        var deputyManagerId = cruiseApplication.FormA.DeputyManagerId;

        var doneEffects = cruiseApplication.FormC.ResearchTaskEffects
            .Where(effect => effect.Done.ToBool());
        
        foreach (var effect in doneEffects)
        {
            var pointsForManagersTeam = GetPointsForManagersTeam(effect, cruiseApplication);

            if (pointsForManagersTeam[CruiseFunction.CruiseManager] > 0)
                await AddEvaluationForUser(
                    effect,
                    cruiseManagerId,
                    pointsForManagersTeam[CruiseFunction.CruiseManager],
                    cancellationToken);
            if (pointsForManagersTeam[CruiseFunction.DeputyManager] > 0)
                await AddEvaluationForUser(
                    effect,
                    deputyManagerId,
                    pointsForManagersTeam[CruiseFunction.DeputyManager],
                    cancellationToken);
        }
    }

    private Dictionary<CruiseFunction, int> GetPointsForManagersTeam(
        ResearchTaskEffect effect, CruiseApplication cruiseApplication)
    {
        var managerPoints = 0;
        var deputyPoints = 0;

        var managerConditionMet = effect.ManagerConditionMet.ToBool();
        var deputyConditionMet = effect.DeputyConditionMet.ToBool();

        switch (effect.ResearchTask.Type)
        {
            case ResearchTaskType.BachelorThesis:
                managerPoints = managerConditionMet ? EvaluationConstants.PointsForBachelorThesisEffect : 0;
                deputyPoints = deputyConditionMet ? EvaluationConstants.PointsForBachelorThesisEffect : 0;
                break;

            case ResearchTaskType.MasterThesis:
                managerPoints = managerConditionMet ? EvaluationConstants.PointsForMasterThesisEffect : 0;
                deputyPoints = deputyConditionMet ? EvaluationConstants.PointsForMasterThesisEffect : 0;
                break;

            case ResearchTaskType.DoctoralThesis:
                managerPoints = managerConditionMet ? EvaluationConstants.PointsForDoctoralThesisEffect : 0;
                deputyPoints = deputyConditionMet ? EvaluationConstants.PointsForDoctoralThesisEffect : 0;
                break;

            case ResearchTaskType.ProjectPreparation:
                var supplementaryConditionMet = CheckSupplementaryCondition(effect);
                managerPoints = supplementaryConditionMet || managerConditionMet
                    ? EvaluationConstants.PointsForProjectPreparationEffect
                    : 0;
                deputyPoints = supplementaryConditionMet ? EvaluationConstants.PointsForProjectPreparationEffect : 0;
                break;

            case ResearchTaskType.DomesticProject:
            case ResearchTaskType.ForeignProject:
            case ResearchTaskType.InternalUgProject:
            case ResearchTaskType.OtherProject:
            case ResearchTaskType.OwnResearchTask:
                var publicationMinisterialPoints = int.Parse(effect.PublicationMinisterialPoints ?? "0");
                managerPoints = publicationMinisterialPoints / 2;
                deputyPoints = publicationMinisterialPoints / 2;
                break;
            
            case ResearchTaskType.OtherResearchTask:
                var evaluationBeforeCruise = GetResearchTaskEvaluationFromBeforeCruise(effect, cruiseApplication);
                managerPoints = evaluationBeforeCruise;
                deputyPoints = evaluationBeforeCruise;
                break;
        }

        return new Dictionary<CruiseFunction, int>
        {
            { CruiseFunction.CruiseManager, managerPoints },
            { CruiseFunction.DeputyManager, deputyPoints }
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
                return publicationPoints >= EvaluationConstants.ProjectPreparationPublicationMinisterialPointsThreshold;
            
            default:
                return false;
        }
    }

    /// <summary>
    /// Returns the number of points that have been assigned to the researchTask linked with the given effect when
    /// the cruiseApplication was evaluated before the cruise
    /// </summary>
    private static int GetResearchTaskEvaluationFromBeforeCruise(
        ResearchTaskEffect effect, CruiseApplication cruiseApplication)
    {
        Debug.Assert(cruiseApplication.FormA is not null);
        
        return cruiseApplication.FormA.FormAResearchTasks
            .Where(formAResearchTask => formAResearchTask.ResearchTask.Id == effect.ResearchTask.Id)
            .Select(formAResearchTask => formAResearchTask.Points)
            .SingleOrDefault();
    }
    
    private Task AddEvaluationForUser(
        ResearchTaskEffect effect, Guid userId, int points, CancellationToken cancellationToken)
    {
        var userEffect = new UserEffect
        {
            UserId = userId,
            Effect = effect,
            Points = points
        };

        return userEffectsRepository.Add(userEffect, cancellationToken);
    }
}