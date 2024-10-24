using FluentValidation;
using MediatR;
using ResearchCruiseApp_API.Application.Common.Extensions;
using ResearchCruiseApp_API.Application.Common.Models.ServiceResult;
using ResearchCruiseApp_API.Application.ExternalServices.Persistence;
using ResearchCruiseApp_API.Application.ExternalServices.Persistence.Repositories;
using ResearchCruiseApp_API.Application.Models.DTOs.CruiseApplications;
using ResearchCruiseApp_API.Application.Services.CruiseApplicationEvaluator;
using ResearchCruiseApp_API.Application.Services.Effects;
using ResearchCruiseApp_API.Application.Services.Factories.FormsC;
using ResearchCruiseApp_API.Application.Services.Forms;
using ResearchCruiseApp_API.Application.Services.UserPermissionVerifier;
using ResearchCruiseApp_API.Domain.Common.Enums;
using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Application.UseCases.CruiseApplications.AddFormC;


public class AddFormCHandler(
    IValidator<AddFormCCommand> validator,
    ICruiseApplicationsRepository cruiseApplicationsRepository,
    IFormsCFactory formsCFactory,
    IUnitOfWork unitOfWork,
    IUserPermissionVerifier userPermissionVerifier,
    IFormsService formsService,
    IEffectsService effectsService,
    ICruiseApplicationEvaluator cruiseApplicationEvaluator)
    : IRequestHandler<AddFormCCommand, Result>
{
    public async Task<Result> Handle(AddFormCCommand request, CancellationToken cancellationToken)
    {
        var validationResult = await validator.ValidateAsync(request, cancellationToken);
        if (!validationResult.IsValid)
            return validationResult.ToApplicationResult();

        var cruiseApplicationResult = await GetCruiseApplication(request.CruiseApplicationId, cancellationToken);
        if (!cruiseApplicationResult.IsSuccess)
            return cruiseApplicationResult;
        
        var cruiseApplication = cruiseApplicationResult.Data!;
        var result = await unitOfWork.ExecuteIsolated(
            () => AddNewFormC(request.FormCDto, cruiseApplication, cancellationToken),
            cancellationToken);
        
        return result;
    }


    private async Task<Result<CruiseApplication>> GetCruiseApplication(Guid id, CancellationToken cancellationToken)
    {
        var cruiseApplication = await cruiseApplicationsRepository
            .GetByIdWithFormAAndFormCContent(id, cancellationToken);
        
        if (cruiseApplication is null)
            return Error.ResourceNotFound();
        if (!await userPermissionVerifier.CanCurrentUserAddForm(cruiseApplication))
            return Error.ResourceNotFound();
        if (cruiseApplication.Status != CruiseApplicationStatus.Undertaken)
            return Error.ForbiddenOperation("Obecnie nie można wysłać Formularza C.");

        return cruiseApplication;
    }

    private async Task<Result> AddNewFormC(
        FormCDto formCDto, CruiseApplication cruiseApplication, CancellationToken cancellationToken)
    {
        var oldFormC = cruiseApplication.FormC;
        var newFormCResult = await formsCFactory.Create(formCDto, cancellationToken);
        
        if (!newFormCResult.IsSuccess)
            return newFormCResult.Error!;
        var newFormC = newFormCResult.Data!;

        cruiseApplication.FormC = newFormC;
        cruiseApplication.Status = CruiseApplicationStatus.Reported;

        await unitOfWork.Complete(cancellationToken);

        if (oldFormC is not null)
            await formsService.DeleteFormC(oldFormC, cancellationToken);

        await HandleEvaluations(cruiseApplication, cancellationToken);

        return Result.Empty;
    }

    private async Task HandleEvaluations(CruiseApplication cruiseApplication, CancellationToken cancellationToken)
    {
        await effectsService.EvaluateEffects(cruiseApplication, cancellationToken);

        await unitOfWork.Complete(cancellationToken);

        await cruiseApplicationEvaluator.UpdateCruiseApplicationsEffectsEvaluations(
            [
                cruiseApplication.FormA!.CruiseManagerId,
                cruiseApplication.FormA.DeputyManagerId
            ],
            cancellationToken);

        await unitOfWork.Complete(cancellationToken);
    }
}