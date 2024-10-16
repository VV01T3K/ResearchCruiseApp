using System.Diagnostics;
using ResearchCruiseApp_API.Application.Common.Constants;
using ResearchCruiseApp_API.Domain.Common.Enums;
using ResearchCruiseApp_API.Domain.Common.Extensions;
using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Application.Services.CruiseApplicationEvaluator;


public class CruiseApplicationEvaluator : ICruiseApplicationEvaluator
{
    public void Evaluate(CruiseApplication cruiseApplication)
    {
        if (cruiseApplication.FormA is null)
            return;
        
        EvaluateResearchTasks(cruiseApplication);
        EvaluateContracts(cruiseApplication);
        EvaluateUgUnits(cruiseApplication);
        EvaluatePublications(cruiseApplication);
        EvaluateSpubTasks(cruiseApplication);
        EvaluateEffects(cruiseApplication);
    }

    public int GetPointsSum(CruiseApplication cruiseApplication)
    {
        var formA = cruiseApplication.FormA;
        if (formA is null)
            return 0;

        var researchTaskPoints = formA.FormAResearchTasks
            .Sum(formAResearchTask => formAResearchTask.Points);
        var contractsPoints = formA.FormAContracts
            .Sum(formAContract => formAContract.Points);
        var publicationsPoints = formA.FormAPublications
            .Sum(formAPublication => formAPublication.Points);
        var spubTasksPoints = formA.FormASpubTasks
            .Sum(formASpubTask => formASpubTask.Points);

        return researchTaskPoints + contractsPoints + int.Parse(formA.UgUnitsPoints) + publicationsPoints + spubTasksPoints;
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

                ResearchTaskType.ProjectPreparation =>
                    researchTask.FinancingApproved?.ToBool() ?? false
                        ? EvaluationConstants.PointsForProjectPreparationWithFinancing
                        : EvaluationConstants.PointsForProjectPreparationWithoutFinancing,

                ResearchTaskType.DomesticProject when researchTask.FinancingAmount is not null =>
                    EvaluationConstants.PointsPerDivisionForDomesticProject *
                    (int.Parse(researchTask.FinancingAmount) / EvaluationConstants.DomesticProjectDivision),

                ResearchTaskType.ForeignProject when researchTask.FinancingAmount is not null =>
                    EvaluationConstants.PointsPerDivisionForForeignProject *
                    (int.Parse(researchTask.FinancingAmount) / EvaluationConstants.ForeignProjectDivision),

                ResearchTaskType.InternalUgProject =>
                    EvaluationConstants.PointsForInternalUgProject,

                ResearchTaskType.OwnResearchTask =>
                    EvaluationConstants.PointsForOwnResearchTask,

                _ => 0
            };
        }
    }

    private static void EvaluateContracts(CruiseApplication cruiseApplication)
    {
        Debug.Assert(cruiseApplication.FormA is not null);

        foreach (var formAContract in cruiseApplication.FormA.FormAContracts)
        {
            var contract = formAContract.Contract;

            if (contract.Category == ContractCategory.Domestic.GetStringValue())
                formAContract.Points = EvaluationConstants.PointsForDomesticContract;
            if (contract.Category == ContractCategory.International.GetStringValue())
                formAContract.Points = EvaluationConstants.PointsForInternationalContract;
        }
    }

    private static void EvaluateUgUnits(CruiseApplication cruiseApplication)
    {
        Debug.Assert(cruiseApplication.FormA is not null);

        var notEmptyTeamsCount = cruiseApplication.FormA.FormAUgUnits
            .Count(formAUgUnit => int.Parse(formAUgUnit.NoOfEmployees) > 0 || int.Parse(formAUgUnit.NoOfStudents) > 0);

        cruiseApplication.FormA.UgUnitsPoints = notEmptyTeamsCount switch
        {
            >= 3 => EvaluationConstants.PointsFor3OrMoreUgUnits.ToString(),
            2 => EvaluationConstants.PointsFor2UgUnits.ToString(),
            _ => 0.ToString()
        };
    }
    
    private static void EvaluatePublications(CruiseApplication cruiseApplication)
    {
        Debug.Assert(cruiseApplication.FormA is not null);
        
        foreach (var formAPublication in cruiseApplication.FormA.FormAPublications)
        {
            var publication = formAPublication.Publication;
            
            double ministerialPointsRatio = 0;
            if (publication.Category == PublicationCategory.Subject.GetStringValue())
                ministerialPointsRatio = EvaluationConstants.MinisterialPointsRatioForSubjectPublication;
            if (publication.Category == PublicationCategory.Postscript.GetStringValue())
                ministerialPointsRatio = EvaluationConstants.MinisterialPointsRatioForPostscriptPublication;
            
            formAPublication.Points = (int)(int.Parse(publication.MinisterialPoints) * ministerialPointsRatio);
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
    
    
    private static void EvaluateEffects(CruiseApplication cruiseApplication)
    {
        Debug.Assert(cruiseApplication.FormA is not null);
        var currentCruiseManagerId = cruiseApplication.FormA.CruiseManagerId;
        
        foreach (var cruiseApplicationEffect in cruiseApplication.CruiseApplicationEffects)
        {
            var effect = cruiseApplicationEffect.Effect;
            if (!effect.Done.ToBool())
                continue;

            // Some points are assigned only if some additional condition is satisfied for the completed cruise's
            // manager or deputy. They are called 'conditional points'. Points that can be assign without additional
            // requirements are called 'unconditional points'.
            var assignConditionalPoints = CheckIfAssignConditionalEffectsPoints(effect, currentCruiseManagerId);

            cruiseApplicationEffect.Points = effect.ResearchTask.Type switch
            {
                ResearchTaskType.BachelorThesis =>
                    assignConditionalPoints ? EvaluationConstants.PointsForBachelorThesisEffect : 0,
                
                ResearchTaskType.MasterThesis =>
                    assignConditionalPoints ? EvaluationConstants.PointsForMasterThesisEffect : 0,
                
                ResearchTaskType.DoctoralThesis =>
                    assignConditionalPoints ? EvaluationConstants.PointsForDoctoralThesisEffect : 0,
                
                ResearchTaskType.ProjectPreparation =>
                    GetPointsForProjectPreparationEffect(effect, assignConditionalPoints),
                
                ResearchTaskType.DomesticProject or
                    ResearchTaskType.ForeignProject or
                    ResearchTaskType.InternalUgProject or
                    ResearchTaskType.OtherProject or 
                    ResearchTaskType.OwnResearchTask =>
                    int.Parse(effect.PublicationMinisterialPoints ?? "0") / 2,
                
                _ => 0
            };
        }
    }

    private static bool CheckIfAssignConditionalEffectsPoints(ResearchTaskEffect effect, Guid currentCruiseManagerId)
    {
        if (effect.FormC.CruiseApplication.FormA is null) // Should have been loaded by CruiseApplicationFactory
            return false;
        
        var wasCurrentManagerManager = effect.FormC.CruiseApplication.FormA.CruiseManagerId == currentCruiseManagerId;
        var wasCurrentManagerDeputy = effect.FormC.CruiseApplication.FormA.DeputyManagerId == currentCruiseManagerId;

        return
            wasCurrentManagerManager && effect.ManagerConditionMet.ToBool() ||
            wasCurrentManagerDeputy && effect.DeputyConditionMet.ToBool();
    }

    private static int GetPointsForProjectPreparationEffect(ResearchTaskEffect effect, bool assignConditinalPoints)
    {
        var assignUnconditionalPoints =
            effect.PublicationMinisterialPoints is not null &&
            int.Parse(effect.PublicationMinisterialPoints) >=
                EvaluationConstants.ProjectPreparationPublicationMinisterialPointsThreshold;

        return assignUnconditionalPoints || assignConditinalPoints
            ? EvaluationConstants.PointsForProjectPreparationEffect
            : 0;
    }
}