using System.Data;
using FluentValidation;
using MediatR;
using Microsoft.Build.Evaluation;
using ResearchCruiseApp_API.Application.Common.Extensions;
using ResearchCruiseApp_API.Application.Common.Models.ServiceResult;
using ResearchCruiseApp_API.Application.ExternalServices.Persistence;
using ResearchCruiseApp_API.Application.ExternalServices.Persistence.Repositories;
using ResearchCruiseApp_API.Application.Models.DTOs.CruiseApplications;
using ResearchCruiseApp_API.Application.Services.EffectsEvaluator;
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
    IEffectsEvaluator effectsEvaluator)
    : IRequestHandler<AddFormCCommand, Result>
{
    public async Task<Result> Handle(AddFormCCommand request, CancellationToken cancellationToken)
    {
        var validationResult = await validator.ValidateAsync(request, cancellationToken);
        if (!validationResult.IsValid)
            return validationResult.ToApplicationResult();
        
        var cruiseApplication = await cruiseApplicationsRepository
            .GetByIdWithFormsAndFormCContentAndResearchTasks(request.CruiseApplicationId, cancellationToken);
        
        if (cruiseApplication is null)
            return Error.ResourceNotFound();
        if (!await userPermissionVerifier.CanCurrentUserAddForm(cruiseApplication))
            return Error.ResourceNotFound();
        if (cruiseApplication.Status != CruiseApplicationStatus.Undertaken)
            return Error.ForbiddenOperation("Obecnie nie można wysłać Formularza C.");

        var result = await unitOfWork.ExecuteIsolated(
            () => AddNewFormC(request.FormCDto, cruiseApplication, cancellationToken),
            cancellationToken);

        if (!result.IsSuccess)
            return result;
        
        cruiseApplication.Status = CruiseApplicationStatus.Reported;
        await effectsEvaluator.Evaluate(cruiseApplication, cancellationToken);
        await unitOfWork.Complete(cancellationToken);
        
        return Result.Empty;
    }
    
    
    private async Task<Result> AddNewFormC(
        FormCDto formCDto, CruiseApplication cruiseApplication, CancellationToken cancellationToken)
    {
        var oldFormC = cruiseApplication.FormC;
        var newFormCResult = await formsCFactory.Create(formCDto, cancellationToken);
        
        if (!newFormCResult.IsSuccess)
            return newFormCResult.Error!;
        
        cruiseApplication.FormC = newFormCResult.Data!;
        await unitOfWork.Complete(cancellationToken);

        if (oldFormC is not null)
            await formsService.DeleteFormC(oldFormC, cancellationToken);

        return Result.Empty;
    }
}