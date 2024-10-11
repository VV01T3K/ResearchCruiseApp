using MediatR;
using ResearchCruiseApp_API.Application.Common.Models.ServiceResult;
using ResearchCruiseApp_API.Application.ExternalServices.Persistence;
using ResearchCruiseApp_API.Application.ExternalServices.Persistence.Repositories;
using ResearchCruiseApp_API.Application.Services.Factories.FormsB;
using ResearchCruiseApp_API.Application.Services.UserPermissionVerifier;

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

        if (cruiseApplication.FormB is not null)
            return Error.Forbidden("Formularz B został już dodany do tego zgłoszenia.");

        var formB = await formsBFactory.Create(request.FormBDto, cancellationToken);
        cruiseApplication.FormB = formB;
        
        await unitOfWork.Complete(cancellationToken);
        return Result.Empty;
    }
}