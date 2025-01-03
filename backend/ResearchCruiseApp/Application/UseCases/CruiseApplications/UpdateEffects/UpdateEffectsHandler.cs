using MediatR;
using ResearchCruiseApp.Application.ExternalServices.Persistence;
using ResearchCruiseApp.Application.ExternalServices.Persistence.Repositories;
using ResearchCruiseApp.Application.Models.Common.ServiceResult;
using ResearchCruiseApp.Application.Models.DTOs.CruiseApplications;
using ResearchCruiseApp.Application.Services.EffectsService;
using ResearchCruiseApp.Application.Services.UserPermissionVerifier;
using ResearchCruiseApp.Domain.Common.Enums;
using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Application.UseCases.CruiseApplications.UpdateEffects;

public class UpdateEffectsHandler(
    ICruiseApplicationsRepository cruiseApplicationsRepository,
    IUserPermissionVerifier userPermissionVerifier,
    IEffectsService effectsService,
    IUnitOfWork unitOfWork
) : IRequestHandler<UpdateEffectsCommand, Result>
{
    public async Task<Result> Handle(
        UpdateEffectsCommand request,
        CancellationToken cancellationToken
    )
    {
        var cruiseApplicationResult = await GetCruiseApplication(
            request.CruiseApplicationId,
            cancellationToken
        );
        if (!cruiseApplicationResult.IsSuccess)
            return cruiseApplicationResult;

        var cruiseApplication = cruiseApplicationResult.Data!;

        await unitOfWork.ExecuteIsolated(
            () => UpdateEffects(request.EffectsUpdatesDto, cruiseApplication, cancellationToken),
            cancellationToken
        );

        return Result.Empty;
    }

    private async Task<Result<CruiseApplication>> GetCruiseApplication(
        Guid id,
        CancellationToken cancellationToken
    )
    {
        var cruiseApplication = await cruiseApplicationsRepository.GetByIdWithFormAAndFormCContent(
            id,
            cancellationToken
        );

        if (cruiseApplication is not { FormA: not null, FormC: not null })
            return Error.ResourceNotFound();
        if (!await userPermissionVerifier.CanCurrentUserUpdateEffects(cruiseApplication))
            return Error.ResourceNotFound();
        if (cruiseApplication.Status != CruiseApplicationStatus.Reported)
            return Error.ForbiddenOperation("Obecnie nie można aktualizować efektów.");

        return cruiseApplication;
    }

    private async Task UpdateEffects(
        EffectsUpdatesDto effectsUpdatesDto,
        CruiseApplication cruiseApplication,
        CancellationToken cancellationToken
    )
    {
        await effectsService.DeleteResearchTasksEffects(
            cruiseApplication.FormC!,
            cancellationToken
        );
        await unitOfWork.Complete(cancellationToken);

        await effectsService.AddResearchTasksEffects(
            cruiseApplication.FormC!,
            effectsUpdatesDto.ResearchTasksEffects,
            cancellationToken
        );
        await effectsService.EvaluateEffects(cruiseApplication, cancellationToken);
        await unitOfWork.Complete(cancellationToken);
    }
}
