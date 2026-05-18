using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using ResearchCruiseApp.Api.Applications.Contracts;
using ResearchCruiseApp.Api.Applications.Factories.FormADtos;
using ResearchCruiseApp.Api.Applications.Factories.FormAInitValuesDtos;
using ResearchCruiseApp.Api.Applications.Workflows;
using ResearchCruiseApp.Api.Common.ServiceResult;
using ResearchCruiseApp.Domain.Logic;
using ResearchCruiseApp.Infrastructure.Persistence;
using ResearchCruiseApp.Infrastructure.Persistence.Repositories.Extensions;

namespace ResearchCruiseApp.Api.Applications;

public static class SupervisorReview
{
    public static void Map(RouteGroupBuilder group)
    {
        group
            .MapGet("/{applicationId:guid}/supervisor-review", Get)
            .WithName("GetApplicationSupervisorReviewV2")
            .WithSummary("Get the anonymous supervisor review view.")
            .ProducesProblem(StatusCodes.Status404NotFound)
            .AllowAnonymous();

        group
            .MapPut("/{applicationId:guid}/supervisor-review/decision", UpdateDecision)
            .WithName("UpdateApplicationSupervisorReviewDecisionV2")
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
        ICruiseApplicationsService cruiseApplicationsService,
        IFormADtosFactory formADtosFactory,
        IFormAInitValuesDtosFactory formAInitValuesDtosFactory,
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

        var form = await formADtosFactory.Create(application.FormA);
        var initValues = await formAInitValuesDtosFactory.CreateForSupervisor(
            application,
            cancellationToken
        );

        return TypedResults.Ok(new SupervisorReviewResponse(form, initValues));
    }

    private static async Task<Results<NoContent, ProblemHttpResult>> UpdateDecision(
        Guid applicationId,
        SupervisorDecisionRequest request,
        ApplicationDbContext dbContext,
        ICruiseApplicationsService cruiseApplicationsService,
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
                _ => throw new ArgumentOutOfRangeException(),
            };
        }

        await dbContext.SaveChangesAsync(cancellationToken);
        return TypedResults.NoContent();
    }
}

public sealed record SupervisorReviewResponse(FormADto Form, FormAInitValuesDto InitValues);

public sealed record SupervisorDecisionRequest(bool Accept, string Code);
