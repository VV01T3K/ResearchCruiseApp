using System.Text;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.WebUtilities;
using ResearchCruiseApp.Domain;

namespace ResearchCruiseApp.Api.Auth;

public static class EmailConfirmationEndpoints
{
    public static void Map(RouteGroupBuilder group)
    {
        MapConfirm(group);
        MapResend(group);
    }

    private static void MapConfirm(RouteGroupBuilder group)
    {
        group
            .MapGet("/confirm-email", Confirm)
            .WithName("ConfirmEmail")
            .WithSummary("Confirm an account email.")
            .ProducesProblem(StatusCodes.Status400BadRequest)
            .AllowAnonymous();
    }

    private static void MapResend(RouteGroupBuilder group)
    {
        group
            .MapPost("/resend-confirmation-email", Resend)
            .WithName("ResendConfirmationEmail")
            .WithSummary("Resend an account confirmation email.")
            .ProducesValidationProblem()
            .WithRequestValidation<ResendConfirmationEmailRequest>()
            .AllowAnonymous();
    }

    private static async Task<Results<NoContent, ProblemHttpResult>> Confirm(
        [AsParameters] ConfirmEmailRequest request,
        HttpContext httpContext,
        UserManager<User> userManager
    )
    {
        if (httpContext.Request.Query.ContainsKey("changedEmail"))
            return TypedResults.Problem(
                detail: "Query parameter 'changedEmail' is no longer supported.",
                statusCode: StatusCodes.Status400BadRequest
            );

        var invalidLink = Error
            .InvalidArgument("Link potwierdzający jest nieprawidłowy lub wygasł.")
            .ToProblemHttpResult();

        if (await userManager.FindByIdAsync(request.UserId.ToString()) is not { } user)
            return invalidLink;

        string code;
        try
        {
            code = Encoding.UTF8.GetString(WebEncoders.Base64UrlDecode(request.Code));
        }
        catch (FormatException)
        {
            return invalidLink;
        }

        var result = await userManager.ConfirmEmailAsync(user, code);

        return result.Succeeded ? TypedResults.NoContent() : invalidLink;
    }

    private static async Task<NoContent> Resend(
        ResendConfirmationEmailRequest request,
        UserManager<User> userManager,
        EmailSender emailSender
    )
    {
        var user = await userManager.FindByEmailAsync(request.Email);
        if (user is null)
            return TypedResults.NoContent(); // According to Microsoft, responding with an error would give too much information

        var emailConfirmationCode = await userManager.CreateEmailConfirmationCode(user);
        var userDto = await userManager.CreateUserDto(user);

        await emailSender.SendEmailConfirmationEmail(
            userDto,
            RoleName.CruiseManager,
            emailConfirmationCode
        );
        return TypedResults.NoContent();
    }
}
