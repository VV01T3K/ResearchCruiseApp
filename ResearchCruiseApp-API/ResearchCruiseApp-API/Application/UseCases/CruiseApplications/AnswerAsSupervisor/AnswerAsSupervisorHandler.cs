using MediatR;
using ResearchCruiseApp_API.Application.Common.Models.ServiceResult;
using ResearchCruiseApp_API.Application.ExternalServices.Persistence;
using ResearchCruiseApp_API.Application.ExternalServices.Persistence.Repositories;
using ResearchCruiseApp_API.Application.SharedServices.CruiseApplications;
using ResearchCruiseApp_API.Domain.Common.Enums;
using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Application.UseCases.CruiseApplications.AnswerAsSupervisor;


public class AnswerAsSupervisorHandler(
    ICruiseApplicationsService cruiseApplicationsService,
    ICruiseApplicationsRepository cruiseApplicationsRepository,
    IUnitOfWork unitOfWork)
    : IRequestHandler<AnswerAsSupervisorCommand, Result>
{
    public async Task<Result> Handle(AnswerAsSupervisorCommand request, CancellationToken cancellationToken)
    {
        var cruiseApplication = await cruiseApplicationsRepository
            .GetById(request.CruiseApplicationId, cancellationToken);
        if (cruiseApplication is null)
            return Error.NotFound();
        
        if (!cruiseApplicationsService.CheckSupervisorCode(cruiseApplication.SupervisorCode, request.SupervisorCode))
            return Error.NotFound(); // Returning 401 or similar would give too much information

        var result = UpdateCruiseApplicationStatus(cruiseApplication, request.Accept);
        
        if (result.IsSuccess)
            await unitOfWork.Complete(cancellationToken);
        
        return result;
    }


    private static Result UpdateCruiseApplicationStatus(CruiseApplication cruiseApplication, bool accept)
    {
        if (cruiseApplication.Status != CruiseApplicationStatus.WaitingForSupervisor)
            return Error.BadRequest("Odpowiedź od przełożonego została już udzielona.");
        
        cruiseApplication.Status = accept
            ? CruiseApplicationStatus.AcceptedBySupervisor
            : CruiseApplicationStatus.DeniedBySupervisor;

        return Result.Empty;
    }
}