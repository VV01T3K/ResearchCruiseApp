using MediatR;
using ResearchCruiseApp_API.Application.Common.Models.ServiceResult;
using ResearchCruiseApp_API.Application.ExternalServices.Persistence;
using ResearchCruiseApp_API.Application.ExternalServices.Persistence.Repositories;
using ResearchCruiseApp_API.Application.Models.DTOs.CruiseApplications;
using ResearchCruiseApp_API.Application.Services.Effects;
using ResearchCruiseApp_API.Application.Services.UserPermissionVerifier;
using ResearchCruiseApp_API.Domain.Common.Enums;
using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Application.UseCases.CruiseApplications.UpdateEffects;


public class UpdateEffectsHandler(
    ICruiseApplicationsRepository cruiseApplicationsRepository,
    IUserPermissionVerifier userPermissionVerifier,
    IEffectsService effectsService,
    IUnitOfWork unitOfWork)
    : IRequestHandler<UpdateEffectsCommand, Result>
{
    public async Task<Result> Handle(UpdateEffectsCommand request, CancellationToken cancellationToken)
    {
        var cruiseApplicationResult = await GetCruiseApplication(request.CruiseApplicationId, cancellationToken);
        if (!cruiseApplicationResult.IsSuccess)
            return cruiseApplicationResult;
        
        var cruiseApplication = cruiseApplicationResult.Data!;
        
        await unitOfWork.ExecuteIsolated(
            () => UpdateEffects(request.EffectsUpdatesDto, cruiseApplication, cancellationToken),
            cancellationToken);
        
        await effectsService.EvaluateEffects(cruiseApplication, cancellationToken);
        await unitOfWork.Complete(cancellationToken);
        
        return Result.Empty;
    }
    
    
    private async Task<Result<CruiseApplication>> GetCruiseApplication(Guid id, CancellationToken cancellationToken)
    {
        var cruiseApplication = await cruiseApplicationsRepository
            .GetByIdWithFormAAndFormCContent(id, cancellationToken);
        
        if (cruiseApplication is not { FormA: not null, FormC: not null })
            return Error.ResourceNotFound();
        if (!await userPermissionVerifier.CanCurrentUserUpdateEffects(cruiseApplication))
            return Error.ResourceNotFound();
        if (cruiseApplication.Status != CruiseApplicationStatus.Reported)
            return Error.ForbiddenOperation("Obecnie nie można aktualizować efektów.");

        return cruiseApplication;
    }

    private async Task UpdateEffects(
        EffectsUpdatesDto effectsUpdatesDto, CruiseApplication cruiseApplication, CancellationToken cancellationToken)
    {
        await effectsService.DeleteResearchTasksEffects(
            cruiseApplication.FormC!,
            cancellationToken);

        await unitOfWork.Complete(cancellationToken);
        
        await effectsService.AddResearchTasksEffects(
            cruiseApplication.FormC!,
            effectsUpdatesDto.ResearchTasksEffects,
            cancellationToken);

        await unitOfWork.Complete(cancellationToken);
    }
}