using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore.Migrations.Operations;
using ResearchCruiseApp.Application.Common.Extensions;
using ResearchCruiseApp.Application.ExternalServices.Persistence;
using ResearchCruiseApp.Application.ExternalServices.Persistence.Repositories;
using ResearchCruiseApp.Application.Models.Common.Commands.CruiseApplications;
using ResearchCruiseApp.Application.Models.Common.ServiceResult;
using ResearchCruiseApp.Application.Models.DTOs.CruiseApplications;
using ResearchCruiseApp.Application.Services.CruiseApplicationEvaluator;
using ResearchCruiseApp.Application.Services.CruiseApplications;
using ResearchCruiseApp.Application.Services.Factories.FormsA;
using ResearchCruiseApp.Application.Services.FormsService;
using ResearchCruiseApp.Application.Services.UserPermissionVerifier;
using ResearchCruiseApp.Domain.Common.Enums;
using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Application.UseCases.CruiseApplications.UpdateFormA;


public class UpdateFormAHandler(
    IValidator<FormACommand> validator,
    ICruiseApplicationsRepository cruiseApplicationsRepository,
    IUserPermissionVerifier userPermissionVerifier,
    IUnitOfWork unitOfWork,
    IFormsAFactory formsAFactory,
    IFormsService formsService,
    ICruiseApplicationsService cruiseApplicationsService,
    ICruiseApplicationEvaluator cruiseApplicationEvaluator)
    : IRequestHandler<UpdateFormACommand, Result>
{
    public async Task<Result> Handle(UpdateFormACommand request, CancellationToken cancellationToken)
    {
        var validationResult = await validator.ValidateAsync(request, cancellationToken);
        if (!validationResult.IsValid)
            return validationResult.ToApplicationResult();

        var cruiseApplication = await cruiseApplicationsRepository
            .GetByIdWithFormAContent(request.CruiseApplicationId, cancellationToken);
        if (cruiseApplication is null)
            return Error.ResourceNotFound();

        var verificationResult = await VerifyOperation(cruiseApplication);
        if (!verificationResult.IsSuccess)
            return verificationResult;

        var result = await unitOfWork.ExecuteIsolated(
            action: () =>
                UpdateCruiseApplication(request.FormADto, request.IsDraft, cruiseApplication, cancellationToken),
            cancellationToken);
        if (!result.IsSuccess)
            return result;
        
        if (!request.IsDraft)
            await cruiseApplicationsService
                .SendRequestToSupervisor(cruiseApplication, request.FormADto.SupervisorEmail);
        
        return Result.Empty;
    }


    private async Task<Result> VerifyOperation(CruiseApplication cruiseApplication)
    {
        if (!await userPermissionVerifier.CanCurrentUserAddForm(cruiseApplication))
            return Error.ResourceNotFound(); // Forbidden may give to much information
        if (cruiseApplication.Status != CruiseApplicationStatus.Draft)
            return Error.ForbiddenOperation("Zgłoszenie nie jest już w stanie wersji roboczej.");
        
        return Result.Empty;
    }

    private async Task<Result> UpdateCruiseApplication(
        FormADto formADto, bool isDraft, CruiseApplication cruiseApplication, CancellationToken cancellationToken)
    {
        var oldFormA = cruiseApplication.FormA;
        
        var result = await UpdateCruiseApplicationProperties(formADto, cruiseApplication, isDraft, cancellationToken);
        if (!result.IsSuccess)
            return result;

        await cruiseApplicationEvaluator.Evaluate(cruiseApplication, isDraft, cancellationToken);
        
        await unitOfWork.Complete(cancellationToken);

        if (oldFormA is not null)
        {
            await formsService.DeleteFormA(oldFormA, cancellationToken);
            await unitOfWork.Complete(cancellationToken);
        }

        return Result.Empty;
    }

    private async Task<Result> UpdateCruiseApplicationProperties(
        FormADto formADto, CruiseApplication cruiseApplication, bool isDraft, CancellationToken cancellationToken)
    {
        var newFormAResult = await formsAFactory.Create(formADto, cancellationToken);
        if (!newFormAResult.IsSuccess)
            return newFormAResult;
        
        if (isDraft)
        {
            cruiseApplication.Note = formADto.Note;
        }
        else
        {
            cruiseApplication.Date = DateOnly.FromDateTime(DateTime.Now);
            cruiseApplication.Status = CruiseApplicationStatus.WaitingForSupervisor;
        }
        cruiseApplication.FormA = newFormAResult.Data!;

        return Result.Empty;
    }
}