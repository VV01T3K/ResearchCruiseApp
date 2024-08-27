using System.Data;
using FluentValidation;
using MediatR;
using Microsoft.IdentityModel.Tokens;
using ResearchCruiseApp_API.Application.Common.Extensions;
using ResearchCruiseApp_API.Application.Common.Models.ServiceResult;
using ResearchCruiseApp_API.Application.ExternalServices;
using ResearchCruiseApp_API.Application.ExternalServices.Persistence;
using ResearchCruiseApp_API.Application.ExternalServices.Persistence.Repositories;
using ResearchCruiseApp_API.Application.SharedServices.Factories.CruiseApplications;
using ResearchCruiseApp_API.Application.SharedServices.Factories.FormsA;
using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Application.UseCases.CruiseApplications.AddCruiseApplication;


public class AddCruiseApplicationHandler(
    IValidator<AddCruiseApplicationCommand> validator,
    IEmailSender emailSender,
    IFormsAFactory formsAFactory,
    ICruiseApplicationsFactory cruiseApplicationsFactory,
    IUnitOfWork unitOfWork,
    IFormsARepository formsARepository,
    ICruiseApplicationsRepository cruiseApplicationsRepository,
    IIdentityService identityService)
    : IRequestHandler<AddCruiseApplicationCommand, Result>
{
    public async Task<Result> Handle(AddCruiseApplicationCommand request, CancellationToken cancellationToken)
    {
        var validationResult = await validator.ValidateAsync(request, cancellationToken);
        if (!validationResult.IsValid)
            return validationResult.ToApplicationResult();
        
        var formA = await formsAFactory.Create(request.FormADto);
        await formsARepository.AddFormA(formA, cancellationToken);

        //var calculatedPoints = cruiseApplicationEvaluator.CalculateSumOfPoints(evaluatedCruiseApplication);

        var newCruiseApplication = await unitOfWork.ExecuteIsolated(
            () => GetNewPersistedCruiseApplication(formA, cancellationToken),
            IsolationLevel.Serializable,
            cancellationToken);
        
        await SendRequestToSupervisor(newCruiseApplication, request.FormADto.SupervisorEmail);

        return Result.Empty;
    }

    private async Task<CruiseApplication> GetNewPersistedCruiseApplication(
        FormA formA, CancellationToken cancellationToken)
    {
        var newCruiseApplication = await cruiseApplicationsFactory.Create(formA, cancellationToken);

        await cruiseApplicationsRepository.Add(newCruiseApplication, cancellationToken);
        await unitOfWork.Complete(cancellationToken);

        return newCruiseApplication;
    }

    private async Task SendRequestToSupervisor(CruiseApplication cruiseApplication, string supervisorEmail)
    {
        var cruiseManagerId = cruiseApplication.FormA?.CruiseManagerId ?? Guid.Empty;
        var supervisorCode = Base64UrlEncoder.Encode(cruiseApplication.SupervisorCode);
        var cruiseManager = (await identityService.GetUserDtoById(cruiseManagerId))!;
        
        await emailSender.SendRequestToSupervisorMessage(
            cruiseApplication.Id, supervisorCode, cruiseManager, supervisorEmail);
    }
}