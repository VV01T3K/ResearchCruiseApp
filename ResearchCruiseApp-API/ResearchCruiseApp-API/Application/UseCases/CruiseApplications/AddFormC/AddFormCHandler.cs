using MediatR;
using ResearchCruiseApp_API.Application.Common.Models.ServiceResult;
using ResearchCruiseApp_API.Application.ExternalServices.Persistence;
using ResearchCruiseApp_API.Application.ExternalServices.Persistence.Repositories;
using ResearchCruiseApp_API.Application.Services.EffectsEvaluator;
using ResearchCruiseApp_API.Application.Services.Factories.FormsC;
using ResearchCruiseApp_API.Application.Services.UserPermissionVerifier;

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

        if (cruiseApplication.FormC is not null)
            return Error.Forbidden("Formularz C został już dodany do tego zgłoszenia.");

        var formC = await formsCFactory.Create(request.FormCDto, cancellationToken);
        cruiseApplication.FormC = formC;
        
        await effectsEvaluator.Evaluate(cruiseApplication, cancellationToken);

        await unitOfWork.Complete(cancellationToken);
        return Result.Empty;
    }
}