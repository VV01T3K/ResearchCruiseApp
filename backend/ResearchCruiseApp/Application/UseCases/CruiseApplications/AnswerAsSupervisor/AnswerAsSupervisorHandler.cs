using MediatR;
using ResearchCruiseApp.Application.ExternalServices.Persistence;
using ResearchCruiseApp.Application.ExternalServices.Persistence.Repositories;
using ResearchCruiseApp.Application.Models.Common.ServiceResult;
using ResearchCruiseApp.Application.Services.CruiseApplications;
using ResearchCruiseApp.Domain.Common.Enums;
using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Application.UseCases.CruiseApplications.AnswerAsSupervisor;

public class AnswerAsSupervisorHandler(
    ICruiseApplicationsService cruiseApplicationsService,
    ICruiseApplicationsRepository cruiseApplicationsRepository,
    IUnitOfWork unitOfWork
) : IRequestHandler<AnswerAsSupervisorCommand, Result>
{
    public async Task<Result> Handle(
        AnswerAsSupervisorCommand request,
        CancellationToken cancellationToken
    )
    {
        var cruiseApplication = await cruiseApplicationsRepository.GetByIdWithFormsAndFormAContent(
            request.CruiseApplicationId,
            cancellationToken
        );
        if (cruiseApplication is null)
            return Error.ResourceNotFound();

        if (
            !cruiseApplicationsService.CheckSupervisorCode(
                cruiseApplication.SupervisorCode,
                request.SupervisorCode
            )
        )
            return Error.ResourceNotFound(); // Returning 401 or similar would give too much information

        var result = UpdateCruiseApplicationStatus(cruiseApplication, request.Accept);

        if (result.IsSuccess)
            await unitOfWork.Complete(cancellationToken);

        return result;
    }

    private static Result UpdateCruiseApplicationStatus(
        CruiseApplication cruiseApplication,
        bool accept
    )
    {
        if (cruiseApplication.Status == CruiseApplicationStatus.Denied)
            return Error.ForbiddenOperation("Biuro Armatora już wcześniej odrzuciło zgłoszenie.");

        if (cruiseApplication.Status != CruiseApplicationStatus.WaitingForSupervisor)
            return Error.ForbiddenOperation("Odpowiedź od przełożonego została już udzielona.");

        cruiseApplication.Status = accept
            ? CruiseApplicationStatus.AcceptedBySupervisor
            : CruiseApplicationStatus.DeniedBySupervisor;

        return Result.Empty;
    }
}
