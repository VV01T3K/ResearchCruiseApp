using MediatR;
using ResearchCruiseApp_API.Application.Common.Models.ServiceResult;
using ResearchCruiseApp_API.Application.ExternalServices.Persistence;
using ResearchCruiseApp_API.Application.ExternalServices.Persistence.Repositories;
using ResearchCruiseApp_API.Application.Services.EffectsEvaluator;
using ResearchCruiseApp_API.Application.Services.Factories.FormsC;
using ResearchCruiseApp_API.Application.Services.UserPermissionVerifier;
using ResearchCruiseApp_API.Domain.Common.Enums;

namespace ResearchCruiseApp_API.Application.UseCases.CruiseApplications.AddFormC;


public class AddFormCHandler(
    ICruiseApplicationsRepository cruiseApplicationsRepository,
    IFormsCFactory formsCFactory,
    IUnitOfWork unitOfWork,
    IUserPermissionVerifier userPermissionVerifier,
    IEffectsEvaluator effectsEvaluator)
    : IRequestHandler<AddFormCCommand, Result>
{
    public async Task<Result> Handle(AddFormCCommand request, CancellationToken cancellationToken)
    {
        var cruiseApplication = await cruiseApplicationsRepository
            .GetByIdWithFormsAndResearchTasks(request.CruiseApplicationId, cancellationToken);
        if (cruiseApplication is null)
            return Error.NotFound();

        if (!await userPermissionVerifier.CanCurrentUserAddForm(cruiseApplication))
            return Error.NotFound();

        if (cruiseApplication.Status != CruiseApplicationStatus.Undertaken &&
            cruiseApplication.Status != CruiseApplicationStatus.Reported &&
            cruiseApplication.Status != CruiseApplicationStatus.Archived)
            return Error.Forbidden("Obecnie nie można wysłać zgłoszenie");

        if (cruiseApplication is { Status: CruiseApplicationStatus.Archived, FormC: not null })
            return Error.Forbidden("Formularz C został już dodany do tego zgłoszenia.");

        var formCResult = await formsCFactory.Create(request.FormCDto, cancellationToken);
        if (!formCResult.IsSuccess)
            return formCResult.Error!;
        
        var formC = formCResult.Data!;
        cruiseApplication.FormC = formC;

        if (cruiseApplication.Status == CruiseApplicationStatus.Undertaken)
            cruiseApplication.Status = CruiseApplicationStatus.Reported;
        
        await effectsEvaluator.Evaluate(cruiseApplication, cancellationToken);

        await unitOfWork.Complete(cancellationToken);
        return Result.Empty;
    }
}