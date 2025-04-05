using FluentValidation;
using MediatR;
using ResearchCruiseApp.Application.Common.Extensions;
using ResearchCruiseApp.Application.ExternalServices.Persistence;
using ResearchCruiseApp.Application.ExternalServices.Persistence.Repositories;
using ResearchCruiseApp.Application.Models.Common.ServiceResult;
using ResearchCruiseApp.Application.Models.DTOs.CruiseApplications;
using ResearchCruiseApp.Application.Services.EffectsService;
using ResearchCruiseApp.Application.Services.Factories.FormsC;
using ResearchCruiseApp.Application.Services.FormsService;
using ResearchCruiseApp.Application.Services.UserPermissionVerifier;
using ResearchCruiseApp.Domain.Common.Enums;
using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Application.UseCases.CruiseApplications.AddFormC;

public class AddFormCHandler(
    IValidator<AddFormCCommand> validator,
    ICruiseApplicationsRepository cruiseApplicationsRepository,
    IFormsCFactory formsCFactory,
    IUnitOfWork unitOfWork,
    IUserPermissionVerifier userPermissionVerifier,
    IFormsService formsService,
    IEffectsService effectsService
) : IRequestHandler<AddFormCCommand, Result>
{
    public async Task<Result> Handle(AddFormCCommand request, CancellationToken cancellationToken)
    {
        var validationResult = await validator.ValidateAsync(request, cancellationToken);
        if (!validationResult.IsValid)
            return validationResult.ToApplicationResult();

        var cruiseApplication = await cruiseApplicationsRepository.GetByIdWithFormAAndFormCContent(
            request.CruiseApplicationId,
            cancellationToken
        );
        if (cruiseApplication is null)
            return Error.ResourceNotFound();

        var verificationResult = await VerifyOperation(cruiseApplication);
        if (!verificationResult.IsSuccess)
            return verificationResult;

        var result = await unitOfWork.ExecuteIsolated(
            () =>
                AddNewFormC(
                    request.FormCDto,
                    request.IsDraft,
                    cruiseApplication,
                    cancellationToken
                ),
            cancellationToken
        );

        return result;
    }

    private async Task<Result> VerifyOperation(CruiseApplication cruiseApplication)
    {
        if (!await userPermissionVerifier.CanCurrentUserAddForm(cruiseApplication))
            return Error.ResourceNotFound();
        if (cruiseApplication.Status != CruiseApplicationStatus.Undertaken)
            return Error.ForbiddenOperation("Obecnie nie można wysłać Formularza C.");

        return Result.Empty;
    }

    private async Task<Result> AddNewFormC(
        FormCDto formCDto,
        bool isDraft,
        CruiseApplication cruiseApplication,
        CancellationToken cancellationToken
    )
    {
        var oldFormC = cruiseApplication.FormC;

        var newFormCResult = await formsCFactory.Create(formCDto, cancellationToken);
        if (!newFormCResult.IsSuccess)
            return newFormCResult;

        cruiseApplication.FormC = newFormCResult.Data!;

        if (!isDraft)
            cruiseApplication.Status = CruiseApplicationStatus.Reported;

        await unitOfWork.Complete(cancellationToken);

        if (oldFormC is not null)
            await formsService.DeleteFormC(oldFormC, cancellationToken);

        if (!isDraft)
            await effectsService.EvaluateEffects(cruiseApplication, cancellationToken);

        await unitOfWork.Complete(cancellationToken);
        return Result.Empty;
    }
}
