using System.Runtime.InteropServices.JavaScript;
using MediatR;
using ResearchCruiseApp.Application.ExternalServices.Persistence;
using ResearchCruiseApp.Application.ExternalServices.Persistence.Repositories;
using ResearchCruiseApp.Application.Models.Common.ServiceResult;
using ResearchCruiseApp.Application.Models.DTOs.CruiseApplications;
using ResearchCruiseApp.Domain.Common.Enums;
using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Application.UseCases.CruiseApplications.EditCruiseApplicationEvaluation;


public class EditCruiseApplicationEvaluationHandler(
    ICruiseApplicationsRepository cruiseApplicationsRepository,
    IFormAResearchTasksRepository formAResearchTasksRepository,
    IFormAContractsRepository formAContractsRepository,
    IFormAPublicationsRepository formAPublicationsRepository,
    IFormASpubTasksRepository formASpubTasksRepository,
    IUnitOfWork unitOfWork)
    : IRequestHandler<EditCruiseApplicationEvaluationCommand, Result>
{
    public async Task<Result> Handle(
        EditCruiseApplicationEvaluationCommand request, CancellationToken cancellationToken)
    {
        var cruiseApplication = await cruiseApplicationsRepository
            .GetByIdWithFormA(request.Id, cancellationToken);

        if (cruiseApplication?.FormA is null)
            return Error.ResourceNotFound();
        
        if (cruiseApplication.Status != CruiseApplicationStatus.Accepted)
            return Error.InvalidArgument("Czas na edycję punktów minął.");
        
        var editsDto = request.CruiseApplicationEvaluationsEditsDto;
        
        await EditResearchTasksEvaluations(editsDto, cancellationToken);
        await EditContractsEvaluations(editsDto, cancellationToken);
        EditUgUnitsEvaluations(cruiseApplication, editsDto);
        await EditPublicationsEvaluations(editsDto, cancellationToken);
        await EditSpubTasksEvaluations(editsDto, cancellationToken);

        await unitOfWork.Complete(cancellationToken);
        
        return Result.Empty;
    }


    private async Task EditResearchTasksEvaluations(
        CruiseApplicationEvaluationsEditsDto cruiseApplicationEvaluationEditsDto, CancellationToken cancellationToken)
    {
        foreach (var researchTaskEvaluationEdit in cruiseApplicationEvaluationEditsDto.ResearchTasksEvaluationsEdits)
        {
            var formAResearchTask = await formAResearchTasksRepository
                .GetById(researchTaskEvaluationEdit.EvaluationId, cancellationToken);
            if (formAResearchTask is null)
                continue;

            formAResearchTask.Points = int.Parse(researchTaskEvaluationEdit.NewPoints);
        }
    }
    
    private async Task EditContractsEvaluations(
        CruiseApplicationEvaluationsEditsDto cruiseApplicationEvaluationEditsDto, CancellationToken cancellationToken)
    {
        foreach (var contractEvaluationEdit in cruiseApplicationEvaluationEditsDto.ContractsEvaluationsEdits)
        {
            var formAContract = await formAContractsRepository
                .GetById(contractEvaluationEdit.EvaluationId, cancellationToken);
            if (formAContract is null)
                continue;

            formAContract.Points = int.Parse(contractEvaluationEdit.NewPoints);
        }
    }
    
    private static void EditUgUnitsEvaluations(
        CruiseApplication cruiseApplication, CruiseApplicationEvaluationsEditsDto cruiseApplicationEvaluationEditsDto)
    {
        cruiseApplication.FormA!.UgUnitsPoints = cruiseApplicationEvaluationEditsDto.NewUgUnitsPoints;
    }
    
    private async Task EditPublicationsEvaluations(
        CruiseApplicationEvaluationsEditsDto cruiseApplicationEvaluationEditsDto, CancellationToken cancellationToken)
    {
        foreach (var publicationEvaluationEdit in cruiseApplicationEvaluationEditsDto.PublicationsEvaluationsEdits)
        {
            var formAPublication = await formAPublicationsRepository
                .GetById(publicationEvaluationEdit.EvaluationId, cancellationToken);
            if (formAPublication is null)
                continue;

            formAPublication.Points = int.Parse(publicationEvaluationEdit.NewPoints);
        }
    }
    
    private async Task EditSpubTasksEvaluations(
        CruiseApplicationEvaluationsEditsDto cruiseApplicationEvaluationEditsDto, CancellationToken cancellationToken)
    {
        foreach (var spubTaskEvaluationEdit in cruiseApplicationEvaluationEditsDto.SpubTaskEvaluationsEdits)
        {
            var formASpubTask = await formASpubTasksRepository
                .GetById(spubTaskEvaluationEdit.EvaluationId, cancellationToken);
            if (formASpubTask is null)
                continue;

            formASpubTask.Points = int.Parse(spubTaskEvaluationEdit.NewPoints);
        }
    }
}