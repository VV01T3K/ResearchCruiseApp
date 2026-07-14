using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using ResearchCruiseApp.Api.Applications.Shared;
using ResearchCruiseApp.Domain;
using ResearchCruiseApp.Infrastructure.Persistence;

namespace ResearchCruiseApp.Api.Applications;

public static class SupervisorReviewEndpoints
{
    public static void Map(RouteGroupBuilder group)
    {
        group
            .MapGet("/{applicationId:guid}/supervisor-review", Get)
            .WithName("GetApplicationSupervisorReview")
            .WithSummary("Get the anonymous supervisor review view.")
            .ProducesProblem(StatusCodes.Status404NotFound)
            .AllowAnonymous();

        group
            .MapPut("/{applicationId:guid}/supervisor-review/decision", UpdateDecision)
            .WithName("UpdateApplicationSupervisorReviewDecision")
            .WithSummary("Accept or reject an application as the anonymous supervisor.")
            .ProducesProblem(StatusCodes.Status400BadRequest)
            .ProducesProblem(StatusCodes.Status403Forbidden)
            .ProducesProblem(StatusCodes.Status404NotFound)
            .AllowAnonymous();
    }

    private static async Task<Results<Ok<SupervisorReviewResponse>, NotFound>> Get(
        Guid applicationId,
        string code,
        ApplicationDbContext dbContext,
        SupervisorInvitationService cruiseApplicationsService,
        FormReader forms,
        FormInitValuesReader formContext,
        CancellationToken cancellationToken
    )
    {
        var application = await dbContext
            .CruiseApplications.IncludeFormA()
            .IncludeFormAContent()
            .SingleOrDefaultAsync(
                application => application.Id == applicationId,
                cancellationToken
            );
        if (
            application?.FormA is null
            || !cruiseApplicationsService.CheckSupervisorCode(application.SupervisorCode, code)
        )
            return TypedResults.NotFound();

        var form = await forms.Create(application.FormA);
        var initValues = await formContext.CreateFormAForSupervisor(application, cancellationToken);

        return TypedResults.Ok(new SupervisorReviewResponse(form, initValues));
    }

    private static async Task<Results<NoContent, ProblemHttpResult>> UpdateDecision(
        Guid applicationId,
        SupervisorDecisionRequest request,
        ApplicationDbContext dbContext,
        SupervisorInvitationService cruiseApplicationsService,
        CancellationToken cancellationToken
    )
    {
        var application = await dbContext
            .CruiseApplications.IncludeForms()
            .IncludeFormAContent()
            .SingleOrDefaultAsync(
                application => application.Id == applicationId,
                cancellationToken
            );
        if (
            application is null
            || !cruiseApplicationsService.CheckSupervisorCode(
                application.SupervisorCode,
                request.Code
            )
        )
            return Error.ResourceNotFound().ToProblemHttpResult();

        var decisionResult = SupervisorDecisionRules.Decide(application, request.Accept);
        if (decisionResult != SupervisorDecisionResult.Applied)
        {
            return decisionResult switch
            {
                SupervisorDecisionResult.RejectedByOffice => Error
                    .ForbiddenOperation("Biuro Armatora już wcześniej odrzuciło zgłoszenie.")
                    .ToProblemHttpResult(),
                SupervisorDecisionResult.AlreadyAnswered => Error
                    .ForbiddenOperation("Odpowiedź od przełożonego została już udzielona.")
                    .ToProblemHttpResult(),
                _ => throw new InvalidOperationException(
                    $"Unexpected supervisor decision result: {decisionResult}"
                ),
            };
        }

        await dbContext.SaveChangesAsync(cancellationToken);
        return TypedResults.NoContent();
    }
}
