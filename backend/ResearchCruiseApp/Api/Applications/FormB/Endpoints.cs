using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using ResearchCruiseApp.Api.Applications.Shared;
using ResearchCruiseApp.Domain;
using ResearchCruiseApp.Domain.Entities;
using ResearchCruiseApp.Infrastructure.Identity.Permissions;
using ResearchCruiseApp.Infrastructure.Persistence;

namespace ResearchCruiseApp.Api.Applications;

public static class FormBEndpoints
{
    public static void Map(RouteGroupBuilder group)
    {
        group
            .MapGet("/{applicationId:guid}/form-b", Get)
            .WithName("GetApplicationFormB")
            .WithSummary("Get Form B.")
            .ProducesProblem(StatusCodes.Status401Unauthorized)
            .ProducesProblem(StatusCodes.Status404NotFound)
            .RequireAuthorization(AuthorizationPolicies.AnyKnownUser);

        group
            .MapPut("/{applicationId:guid}/form-b", Update)
            .WithName("UpdateApplicationFormB")
            .WithSummary("Create or replace Form B.")
            .ProducesValidationProblem()
            .ProducesProblem(StatusCodes.Status400BadRequest)
            .ProducesProblem(StatusCodes.Status401Unauthorized)
            .ProducesProblem(StatusCodes.Status403Forbidden)
            .ProducesProblem(StatusCodes.Status404NotFound)
            .WithSerializableTransaction()
            .WithRequestValidation<FormBWriteRequest>()
            .RequireAuthorization(AuthorizationPolicies.ApplicationFormEditors);

        group
            .MapPut("/{applicationId:guid}/form-b/refill", Refill)
            .WithName("RefillApplicationFormB")
            .WithSummary("Return Form B to editable state.")
            .ProducesProblem(StatusCodes.Status401Unauthorized)
            .ProducesProblem(StatusCodes.Status403Forbidden)
            .ProducesProblem(StatusCodes.Status404NotFound)
            .WithSerializableTransaction()
            .RequireAuthorization(AuthorizationPolicies.AdministratorsOrShipowners);
    }

    private static async Task<Results<Ok<FormBFields>, NotFound>> Get(
        Guid applicationId,
        ApplicationDbContext dbContext,
        FormReader forms,
        UserPermissionVerifier userPermissionVerifier,
        CancellationToken cancellationToken
    )
    {
        var application = await dbContext
            .CruiseApplications.IncludeFormA()
            .IncludeFormB()
            .IncludeFormBContent()
            .IncludeCruise()
            .SingleOrDefaultAsync(
                application => application.Id == applicationId,
                cancellationToken
            );
        if (
            application?.FormB is null
            || !await userPermissionVerifier.CanCurrentUserViewForm(application)
        )
            return TypedResults.NotFound();

        var fields = await forms.Create(application.FormB);
        fields.Revision = application.RowVersion.ToRevision();
        return TypedResults.Ok(fields);
    }

    private static async Task<Results<Ok<RevisionResponse>, ProblemHttpResult>> Update(
        Guid applicationId,
        FormBWriteRequest request,
        UserPermissionVerifier userPermissionVerifier,
        FormBFactory forms,
        ApplicationDbContext dbContext,
        FormDeletionService formsService,
        CancellationToken cancellationToken
    )
    {
        var application = await dbContext
            .CruiseApplications.AsSplitQuery()
            .IncludeFormA()
            .IncludeFormB()
            .IncludeFormBContent()
            .IncludeCruise()
            .SingleOrDefaultAsync(candidate => candidate.Id == applicationId, cancellationToken);
        if (application is null || !await userPermissionVerifier.CanCurrentUserAddForm(application))
            return Error.ResourceNotFound().ToProblemHttpResult();
        if (!application.RowVersion.Matches(request.Form.Revision))
            return Revisions.StaleRevision();
        if (application.Status != CruiseApplicationStatus.FormBRequired)
            return Error
                .ForbiddenOperation(UpdateRefusal(application.Status))
                .ToProblemHttpResult();

        var oldFormB = application.FormB;
        application.FormB = await forms.Create(request.Form, cancellationToken);
        if (oldFormB is not null)
        {
            // Cleanup counts persisted references. Keep the replacement visible within
            // the endpoint transaction before deciding which shared children to delete.
            await dbContext.SaveChangesAsync(cancellationToken);
            await formsService.DeleteFormB(oldFormB, cancellationToken);
        }

        if (!request.Draft)
            CompleteFormB(application);

        await dbContext.SaveChangesAsync(cancellationToken);
        return TypedResults.Ok(new RevisionResponse(application.RowVersion.ToRevision()));
    }

    private static async Task<Results<NoContent, ProblemHttpResult>> Refill(
        Guid applicationId,
        ApplicationDbContext dbContext,
        CancellationToken cancellationToken
    )
    {
        var application = await dbContext
            .CruiseApplications.IncludeForms()
            .IncludeCruise()
            .SingleOrDefaultAsync(
                application => application.Id == applicationId,
                cancellationToken
            );
        if (application is null)
            return Error.ResourceNotFound().ToProblemHttpResult();
        if (!CanRefillFormB(application.Status))
            return Error
                .ForbiddenOperation(RefillRefusal(application.Status))
                .ToProblemHttpResult();

        application.Status = CruiseApplicationStatus.FormBRequired;
        await dbContext.SaveChangesAsync(cancellationToken);
        return TypedResults.NoContent();
    }

    private static void CompleteFormB(CruiseApplication application)
    {
        application.Status =
            application.Cruise is not null && application.Cruise.Status == CruiseStatus.Ended
                ? CruiseApplicationStatus.Undertaken
                : CruiseApplicationStatus.FormBFilled;
    }

    private static bool CanRefillFormB(CruiseApplicationStatus status) =>
        status is CruiseApplicationStatus.Undertaken or CruiseApplicationStatus.FormBFilled;

    private static string UpdateRefusal(CruiseApplicationStatus status) =>
        status switch
        {
            CruiseApplicationStatus.FormBFilled or CruiseApplicationStatus.Undertaken =>
                "Formularz B został już wysłany. Aby go zmienić, poproś Biuro Armatora o cofnięcie go do edycji.",
            CruiseApplicationStatus.Reported =>
                "Rejs został już rozliczony formularzem C, więc formularza B nie można zmienić.",
            _ =>
                "Formularz B można wysłać dopiero, gdy Biuro Armatora poprosi o jego uzupełnienie.",
        };

    private static string RefillRefusal(CruiseApplicationStatus status) =>
        status switch
        {
            CruiseApplicationStatus.FormBRequired =>
                "Formularz B jest już dostępny do edycji i czeka na wysłanie przez kierownika rejsu.",
            CruiseApplicationStatus.Reported =>
                "Rejs został już rozliczony formularzem C, więc formularza B nie można cofnąć do edycji.",
            _ =>
                "Formularz B można cofnąć do edycji dopiero po jego wysłaniu przez kierownika rejsu.",
        };
}
