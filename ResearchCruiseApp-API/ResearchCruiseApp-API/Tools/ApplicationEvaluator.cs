using System.Globalization;
using ResearchCruiseApp_API.Models;

namespace ResearchCruiseApp_API.Tools;

public class ApplicationEvaluator : IApplicationEvaluator
{
    private const int DefaultPoints = 0;

    private const int BaThesis = 0;
    private const int BaThesisPoints = 20;

    private const int MScThesis = 1;
    private const int MScThesisPoints = 50;

    private const int PhDThesis = 2;
    private const int PhDThesisPoints = 100;

    private const int ScOrRdProject = 3;
    private const int ScOrRdProjectFinancingApprovedPoints = 100;
    private const int ScOrRdProjectFinancingNotApprovedPoints = 150;

    private const int DomesticProject = 4;
    private const int DomesticProjectPoints = 50;
    private const float DomesticProjectPointsRatio = 1 / 100_000f;

    private const int ForeignProject = 5;
    private const int ForeignProjectPoints = 80;
    private const float ForeignProjectPointsRatio = 1 / 100_000f;

    private const int InternalProject = 6;
    private const int InternalProjectPoints = 30;

    private const int CommercialProject = 7;

    private const int DidacticsProject = 8;

    private const int OwnProjectRealizationProject = 9;
    private const int OwnProjectRealizationPoints = 100;

    private const int OtherProject = 10;

    private const string DomesticContract = "domestic";
    private const int DomesticContractPoints = 150;

    private const string InternationalContract = "international";
    private const int ForeignContractPoints = 300;

    private const int UgTeamPointsFromAtLeast3Units = 100;
    private const int UgTeamPointsFromAtLeast2Units = 50;

    private const string DefaultPublication = "subject";
    private const float DefaultPublicationPointRatio = 0.5f;

    private const string PublicationFromRV = "postscript";
    private const float PublicationFromRVPointRatio = 1;

    private const int SpubTaskPoints = 100;


    public EvaluatedApplicationModel EvaluateApplication(FormAModel formA, List<ResearchTask> cruiseEffects)
    {
        var evaluatedApplication = new EvaluatedApplicationModel();

        if (formA.ResearchTasks != null)
        {
            foreach (var researchTask in formA.ResearchTasks)
            {
                evaluatedApplication.ResearchTasks.Add(EvaluateResearchTask(researchTask));
            }
        }

        if (formA.Contracts != null)
        {
            foreach (var contract in formA.Contracts)
            {
                evaluatedApplication.Contracts.Add(EvaluateContract(contract));
            }
        }

        if (formA.GuestTeams != null)
            evaluatedApplication.GuestTeams = formA.GuestTeams;

        if (formA.UgTeams != null)
            evaluatedApplication.UgTeams = formA.UgTeams;

        var emptyTeams = 0;
        foreach (var ugTeam in evaluatedApplication.UgTeams)
        {
            if (ugTeam.NoOfEmployees <= 0 && ugTeam.NoOfStudents <= 0)
                emptyTeams++;
        }

        if (evaluatedApplication.UgTeams.Count - emptyTeams >= 3)
            evaluatedApplication.UgTeamsPoints = UgTeamPointsFromAtLeast3Units;
        else if (evaluatedApplication.UgTeams.Count - emptyTeams >= 2)
            evaluatedApplication.UgTeamsPoints = UgTeamPointsFromAtLeast2Units;
        else
            evaluatedApplication.UgTeamsPoints = DefaultPoints;

        foreach (var publication in formA.Publications)
        {
            evaluatedApplication.Publications.Add(EvaluatePublication(publication));
        }

        foreach (var cruiseEffect in cruiseEffects)
        {
             evaluatedApplication.CruiseEffects.Add(EvaluateResearchTask(cruiseEffect));   
        }

        foreach (var spubTask in formA.SpubTasks)
        {
            evaluatedApplication.SpubTasks.Add(EvaluateSpubTask(spubTask));
        }

        return evaluatedApplication;
    }

    
    private EvaluatedResearchTask EvaluateResearchTask(ResearchTask researchTask)
    {
        if (researchTask.Type == BaThesis)
            return new EvaluatedResearchTask(researchTask, BaThesisPoints);
        if (researchTask.Type == MScThesis)
            return new EvaluatedResearchTask(researchTask, MScThesisPoints);
        if (researchTask.Type == PhDThesis)
            return new EvaluatedResearchTask(researchTask, PhDThesisPoints);
        if (researchTask.Type == ScOrRdProject)
        {
            //  if(researchTask.isFinancingApproved)
            //     return new EvaluatedResearchTask(researchTask,
            //          C.ScOrRdProjectFinancingApprovedPoints);

            return new EvaluatedResearchTask(researchTask,
                ScOrRdProjectFinancingNotApprovedPoints);

        }

        if (researchTask.Type == DomesticProject)
            return new EvaluatedResearchTask(researchTask, (int)(DomesticProjectPoints
                                                                 * Math.Floor(
                                                                     float.Parse(researchTask.Values.FinancingAmount, CultureInfo.InvariantCulture)
                                                                     * DomesticProjectPointsRatio)));
        if (researchTask.Type == ForeignProject)
            return new EvaluatedResearchTask(researchTask, (int)(ForeignProjectPoints
                                                                 * Math.Floor(
                                                                     float.Parse(researchTask.Values.FinancingAmount, CultureInfo.InvariantCulture)
                                                                     * ForeignProjectPointsRatio)));
        if (researchTask.Type == InternalProject)
            return new EvaluatedResearchTask(researchTask, InternalProjectPoints);
        if (researchTask.Type == CommercialProject)
            return new EvaluatedResearchTask(researchTask, DefaultPoints);
        if (researchTask.Type == DidacticsProject)
            return new EvaluatedResearchTask(researchTask, DefaultPoints);
        if (researchTask.Type == OwnProjectRealizationProject)
            return new EvaluatedResearchTask(researchTask, OwnProjectRealizationPoints);
        if (researchTask.Type == OtherProject)
            return new EvaluatedResearchTask(researchTask, DefaultPoints);

        return new EvaluatedResearchTask(researchTask, DefaultPoints);
    }

    private EvaluatedContract EvaluateContract(Contract contract)
    {
        if (contract.Category == DomesticContract)
            return new EvaluatedContract(contract, DomesticContractPoints);
        if (contract.Category == InternationalContract)
            return new EvaluatedContract(contract, ForeignContractPoints);

        return new EvaluatedContract(contract, DefaultPoints);
    }

    private EvaluatedPublication EvaluatePublication(Publication publication)
    {
        if (publication.Category == DefaultPublication)
            return new EvaluatedPublication(publication, (int)(DefaultPublicationPointRatio * publication.Points));
        if (publication.Category == PublicationFromRV)
            return new EvaluatedPublication(publication, (int)(PublicationFromRVPointRatio * publication.Points));

        return new EvaluatedPublication(publication, DefaultPoints);
    }

    private EvaluatedSPUBTask EvaluateSpubTask(SPUBTask spubTask)
    {
        return new EvaluatedSPUBTask(spubTask, SpubTaskPoints);
    }
    
    public int CalculateSumOfPoints(EvaluatedApplicationModel evaluatedApplication)
    {
        var sum = 0;

        foreach (var researchTask in evaluatedApplication.ResearchTasks)
        {
            sum += researchTask.CalculatedPoints;
        }
            
        foreach (var contract in evaluatedApplication.Contracts)
        {
            sum += contract.CalculatedPoints;
        }

        sum += evaluatedApplication.UgTeamsPoints;
            
        foreach (var publication in evaluatedApplication.Publications)
        {
            sum += publication.CalculatedPoints;
        }
            
        foreach (var cruiseEffect in evaluatedApplication.CruiseEffects)
        {
            sum += cruiseEffect.CalculatedPoints;
        }
            
        foreach (var spubTask in evaluatedApplication.SpubTasks)
        {
            sum += spubTask.CalculatedPoints;
        }

        return sum;
    }
}