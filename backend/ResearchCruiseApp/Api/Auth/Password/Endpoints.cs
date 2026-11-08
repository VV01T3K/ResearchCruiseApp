using System.Text;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.WebUtilities;
using NeoSmart.Utils;
using ResearchCruiseApp.Domain;

namespace ResearchCruiseApp.Api.Auth;

public static class PasswordEndpoints
{
    public static void Map(RouteGroupBuilder group)
    {
        MapRequestReset(group);
        MapReset(group);
    }

    private static void MapRequestReset(RouteGroupBuilder group)
    {
        group
            .MapPost("/password-reset-request", RequestReset)
            .WithName("RequestPasswordReset")
            .WithSummary("Request a password reset email.")
            .ProducesValidationProblem()
            .WithRequestValidation<RequestPasswordResetRequest>()
            .AllowAnonymous();
    }

    private static void MapReset(RouteGroupBuilder group)
    {
        group
            .MapPost("/password-reset", Reset)
            .WithName("ResetPassword")
            .WithSummary("Reset an account password.")
            .ProducesValidationProblem()
            .WithRequestValidation<ResetPasswordRequest>()
            .AllowAnonymous();
    }

    private static async Task<NoContent> RequestReset(
        RequestPasswordResetRequest request,
        UserManager<User> userManager,
        EmailSender emailSender
    )
    {
        var user = await userManager.FindByEmailAsync(request.Email);
        if (user is null)
            return TypedResults.NoContent();

        var code = await userManager.GeneratePasswordResetTokenAsync(user);
        code = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(code));

        await emailSender.SendPasswordResetMessage(await userManager.CreateUserDto(user), code);
        return TypedResults.NoContent();
    }

    private static async Task<Results<NoContent, ProblemHttpResult>> Reset(
        ResetPasswordRequest request,
        UserManager<User> userManager
    )
    {
        var invalidLink = Error
            .InvalidArgument("Link do resetowania hasła jest nieprawidłowy lub wygasł.")
            .ToProblemHttpResult();

        string email;
        string resetCode;
        try
        {
            email = Encoding.UTF8.GetString(UrlBase64.Decode(request.EmailBase64));
            resetCode = Encoding.UTF8.GetString(UrlBase64.Decode(request.ResetCode));
        }
        catch (FormatException)
        {
            return invalidLink;
        }

        var user = await userManager.FindByEmailAsync(email);
        if (user is null)
            return invalidLink;

        var refreshToken = user.RefreshToken;
        var refreshTokenExpiry = user.RefreshTokenExpiry;
        user.RefreshToken = null;
        user.RefreshTokenExpiry = null;
        var result = await userManager.ResetPasswordAsync(user, resetCode, request.Password);

        if (result.Succeeded)
            return TypedResults.NoContent();

        user.RefreshToken = refreshToken;
        user.RefreshTokenExpiry = refreshTokenExpiry;
        return invalidLink;
    }
}
