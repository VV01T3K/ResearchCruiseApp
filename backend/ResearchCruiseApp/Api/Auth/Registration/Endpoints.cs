using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity;
using ResearchCruiseApp.Domain;
using ResearchCruiseApp.Infrastructure.Persistence;

namespace ResearchCruiseApp.Api.Auth;

public static class RegistrationEndpoints
{
    public static void Map(RouteGroupBuilder group)
    {
        group
            .MapPost("/register", Handle)
            .WithName("RegisterAccount")
            .WithSummary("Register a new account.")
            .ProducesValidationProblem()
            .WithRequestValidation<RegisterAccountRequest>()
            .AllowAnonymous();
    }

    private static async Task<Results<Created, ProblemHttpResult>> Handle(
        RegisterAccountRequest request,
        UserManager<User> userManager,
        EmailSender emailSender,
        ApplicationDbContext dbContext
    )
    {
        await using var transaction = await dbContext.Database.BeginTransactionAsync();

        if (!userManager.SupportsUserEmail)
            return Error.ServiceUnavailable().ToProblemHttpResult();

        var user = new User
        {
            UserName = request.Email,
            Email = request.Email,
            FirstName = request.FirstName,
            LastName = request.LastName,
            Accepted = false,
            EmailConfirmed = false,
        };
        var identityResult = await userManager.CreateAsync(user, request.Password);
        if (!identityResult.Succeeded)
            return identityResult.ToApplicationResult().Error!.ToProblemHttpResult();

        identityResult = await userManager.AddToRoleAsync(user, RoleName.CruiseManager);
        if (!identityResult.Succeeded)
            return identityResult.ToApplicationResult().Error!.ToProblemHttpResult();

        var emailConfirmationCode = await userManager.CreateEmailConfirmationCode(user);
        await emailSender.SendEmailConfirmationEmail(
            await userManager.CreateUserDto(user),
            RoleName.CruiseManager,
            emailConfirmationCode
        );

        await transaction.CommitAsync();
        return TypedResults.Created();
    }
}
