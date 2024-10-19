using MediatR;
using ResearchCruiseApp_API.Application.Common.Models.ServiceResult;
using ResearchCruiseApp_API.Application.ExternalServices.Persistence;
using ResearchCruiseApp_API.Application.ExternalServices.Persistence.Repositories;
using ResearchCruiseApp_API.Application.Services.Factories.FormsB;
using ResearchCruiseApp_API.Application.Services.UserPermissionVerifier;
using ResearchCruiseApp_API.Domain.Common.Enums;

namespace ResearchCruiseApp_API.Application.UseCases.CruiseApplications.AddFormB;


public class AddFormBHandler(
    ICruiseApplicationsRepository cruiseApplicationsRepository,
    IUserPermissionVerifier userPermissionVerifier,
    IFormsBFactory formsBFactory,
    IUnitOfWork unitOfWork)
    : IRequestHandler<AddFormBCommand, Result>
{
    public async Task<Result> Handle(AddFormBCommand request, CancellationToken cancellationToken)
    {
        var cruiseApplication = await cruiseApplicationsRepository
            .GetByIdWithFormAAndFormB(request.CruiseApplicationId, cancellationToken);
        if (cruiseApplication is null)
            return Error.NotFound();

        if (!await userPermissionVerifier.CanCurrentUserAddForm(cruiseApplication))
            return Error.NotFound();

        if (cruiseApplication.Status != CruiseApplicationStatus.Accepted)
            return Error.Forbidden("Obecnie nie można przesłać formularza B.");

        var formB = await formsBFactory.Create(request.FormBDto, cancellationToken);
        cruiseApplication.FormB = formB;
        
        
        if (cruiseApplication.Cruise is not null && (cruiseApplication.Cruise?.Status == CruiseStatus.Ended ||
            cruiseApplication.Cruise?.Status == CruiseStatus.Archive))
            cruiseApplication.Status = CruiseApplicationStatus.Undertaken;
        else
            cruiseApplication.Status = CruiseApplicationStatus.FormBFilled;
        
        await unitOfWork.Complete(cancellationToken);
        return Result.Empty;
    }
}