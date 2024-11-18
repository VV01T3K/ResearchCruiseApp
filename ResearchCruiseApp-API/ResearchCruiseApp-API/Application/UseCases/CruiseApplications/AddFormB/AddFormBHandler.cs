using System.Data;
using FluentValidation;
using MediatR;
using ResearchCruiseApp_API.Application.Common.Extensions;
using ResearchCruiseApp_API.Application.ExternalServices.Persistence;
using ResearchCruiseApp_API.Application.ExternalServices.Persistence.Repositories;
using ResearchCruiseApp_API.Application.Models.Common.ServiceResult;
using ResearchCruiseApp_API.Application.Models.DTOs.CruiseApplications;
using ResearchCruiseApp_API.Application.Services.Factories.FormsB;
using ResearchCruiseApp_API.Application.Services.FormsService;
using ResearchCruiseApp_API.Application.Services.UserPermissionVerifier;
using ResearchCruiseApp_API.Domain.Common.Enums;
using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Application.UseCases.CruiseApplications.AddFormB;


public class AddFormBHandler(
    IValidator<AddFormBCommand> validator,
    ICruiseApplicationsRepository cruiseApplicationsRepository,
    IUserPermissionVerifier userPermissionVerifier,
    IFormsBFactory formsBFactory,
    IUnitOfWork unitOfWork,
    IFormsService formsService)
    : IRequestHandler<AddFormBCommand, Result>
{
    public async Task<Result> Handle(AddFormBCommand request, CancellationToken cancellationToken)
    {
        var validationResult = await validator.ValidateAsync(request, cancellationToken);
        if (!validationResult.IsValid)
            return validationResult.ToApplicationResult();

        var cruiseApplication = await cruiseApplicationsRepository
            .GetByIdWithFormAAndFormBContent(request.CruiseApplicationId, cancellationToken);
        if (cruiseApplication is null)
            return Error.ResourceNotFound();
        
        var verificationResult = await VerifyOperation(cruiseApplication);
        if (!verificationResult.IsSuccess)
            return verificationResult;

        await unitOfWork.ExecuteIsolated(
            () => AddNewFormB(request.FormBDto, cruiseApplication, cancellationToken),
            cancellationToken);

        UpdateStatus(cruiseApplication);
        
        await unitOfWork.Complete(cancellationToken);
        return Result.Empty;
    }


    private async Task<Result> VerifyOperation(CruiseApplication cruiseApplication)
    {
        if (!await userPermissionVerifier.CanCurrentUserAddForm(cruiseApplication))
            return Error.ResourceNotFound(); // Forbidden may give to much information
        if (cruiseApplication.Status != CruiseApplicationStatus.FormBRequired)
            return Error.ForbiddenOperation("Obecnie nie można przesłać formularza B.");

        return Result.Empty;
    }
    
    private async Task AddNewFormB(
        FormBDto formBDto, CruiseApplication cruiseApplication, CancellationToken cancellationToken)
    {
        var oldFormB = cruiseApplication.FormB;
        var newFormB = await formsBFactory.Create(formBDto, cancellationToken);
        
        cruiseApplication.FormB = newFormB;
        await unitOfWork.Complete(cancellationToken);

        if (oldFormB is not null)
            await formsService.DeleteFormB(oldFormB, cancellationToken);
    }

    private static void UpdateStatus(CruiseApplication cruiseApplication)
    {
        if (cruiseApplication.Cruise is not null && cruiseApplication.Cruise.Status == CruiseStatus.Ended)
            cruiseApplication.Status = CruiseApplicationStatus.Undertaken;
        else
            cruiseApplication.Status = CruiseApplicationStatus.FormBFilled;
    }
}