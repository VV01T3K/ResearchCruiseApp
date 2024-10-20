using FluentValidation;
using MediatR;
using ResearchCruiseApp_API.Application.Common.Extensions;
using ResearchCruiseApp_API.Application.Common.Models.ServiceResult;
using ResearchCruiseApp_API.Application.ExternalServices.Persistence;
using ResearchCruiseApp_API.Application.ExternalServices.Persistence.Repositories;
using ResearchCruiseApp_API.Application.Services.Factories.FormsB;
using ResearchCruiseApp_API.Application.Services.UserPermissionVerifier;
using ResearchCruiseApp_API.Domain.Common.Enums;

namespace ResearchCruiseApp_API.Application.UseCases.CruiseApplications.AddFormB;


public class AddFormBHandler(
    IValidator<AddFormBCommand> validator,
    ICruiseApplicationsRepository cruiseApplicationsRepository,
    IUserPermissionVerifier userPermissionVerifier,
    IFormsBFactory formsBFactory,
    IUnitOfWork unitOfWork)
    : IRequestHandler<AddFormBCommand, Result>
{
    public async Task<Result> Handle(AddFormBCommand request, CancellationToken cancellationToken)
    {
        var validationResult = await validator.ValidateAsync(request, cancellationToken);
        if (!validationResult.IsValid)
            return validationResult.ToApplicationResult();
        
        var cruiseApplication = await cruiseApplicationsRepository
            .GetByIdWithFormAAndFormB(request.CruiseApplicationId, cancellationToken);
        if (cruiseApplication is null)
            return Error.ResourceNotFound();

        if (!await userPermissionVerifier.CanCurrentUserAddForm(cruiseApplication))
            return Error.ResourceNotFound();

        if (cruiseApplication.Status != CruiseApplicationStatus.FormBRequired)
            return Error.ForbiddenOperation("Obecnie nie można przesłać formularza B.");

        var formB = await formsBFactory.Create(request.FormBDto, cancellationToken);
        cruiseApplication.FormB = formB;
        
        cruiseApplication.Status = cruiseApplication.Cruise?.Status is CruiseStatus.Ended or CruiseStatus.Archive
            ? CruiseApplicationStatus.Undertaken
            : CruiseApplicationStatus.FormBFilled;
        
        await unitOfWork.Complete(cancellationToken);
        return Result.Empty;
    }
}