using System.ComponentModel.DataAnnotations;
using System.Diagnostics;
using System.Text;
using Microsoft.AspNetCore.Authentication.BearerToken;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.Extensions.Options;
using ResearchCruiseApp_API.Application.Models.DTOs.Account;
using ResearchCruiseApp_API.Application.Models.DTOs.Users;
using ResearchCruiseApp_API.Application.SharedServices.UserDtos;
using ResearchCruiseApp_API.Application.UseCases.Account;
using ResearchCruiseApp_API.Domain.Common.Constants;
using ResearchCruiseApp_API.Domain.Entities;
using ResearchCruiseApp_API.Infrastructure.Services.Identity;
using ResearchCruiseApp_API.Web.Common.Extensions;

namespace ResearchCruiseApp_API.Web.Controllers;


[Route("[controller]")]
[ApiController]
public class AccountController(
    IAccountService accountService,
    SignInManager<User> signInManager,
    UserManager<User> userManager,
    IUserDtosService userDtosService)
    : ControllerBase
{
    [HttpPost("register")]
    public async Task<IActionResult> Register(
        [FromBody] RegisterFormDto registerForm,
        CancellationToken cancellationToken)
    {
        var result = await accountService.Register(registerForm, cancellationToken);
        return result.Error is null
            ? Created()
            : this.CreateError(result);
    }
        
    [HttpPost("login")]
    public async Task<Results<Ok<AccessTokenResponse>, EmptyHttpResult, ProblemHttpResult>> Login(
        [FromBody] LoginModel loginModel,
        [FromServices] IServiceProvider serviceProvider)
    {
        var user = await userManager.FindByEmailAsync(loginModel.Email);
        if (user is { Accepted: false })
            return TypedResults.Problem(statusCode: StatusCodes.Status401Unauthorized);
            
        const bool isPersistent = false;
        const bool lockoutOnFailure = true;

        signInManager.AuthenticationScheme = IdentityConstants.BearerScheme;
        var result = await signInManager.PasswordSignInAsync(
            loginModel.Email,
            loginModel.Password,
            isPersistent,
            lockoutOnFailure);

        if (!result.Succeeded)
            return TypedResults.Problem(statusCode: StatusCodes.Status401Unauthorized);

        // The signInManager already produced the needed response in the form of a bearer token.
        return TypedResults.Empty;
    }
        
    [HttpPost("refresh")]
    public async
        Task<Results<Ok<AccessTokenResponse>, UnauthorizedHttpResult, SignInHttpResult, ChallengeHttpResult>>
        Refresh([FromBody] RefreshModel refreshModel, [FromServices] IServiceProvider serviceProvider)
    {
        var signInManager = serviceProvider.GetRequiredService<SignInManager<User>>();
        var bearerTokenOptions = serviceProvider.GetRequiredService<IOptionsMonitor<BearerTokenOptions>>();
        var refreshTokenProtector = bearerTokenOptions
            .Get(IdentityConstants.BearerScheme).RefreshTokenProtector;
        var refreshTicket = refreshTokenProtector.Unprotect(refreshModel.RefreshToken);
        var timeProvider = serviceProvider.GetRequiredService<TimeProvider>();
            
        // Reject the /refresh attempt with a 401 if the token expired or the security stamp validation fails
        if (refreshTicket?.Properties?.ExpiresUtc is not { } expiresUtc ||
            timeProvider.GetUtcNow() >= expiresUtc ||
            await signInManager.ValidateSecurityStampAsync(refreshTicket.Principal) is not { } user)
        {
            return TypedResults.Challenge();
        }
    
        var newPrincipal = await signInManager.CreateUserPrincipalAsync(user);
        return TypedResults.SignIn(newPrincipal, authenticationScheme: IdentityConstants.BearerScheme);
    }
        
    [HttpGet("confirmEmail")]
    public async Task<Results<ContentHttpResult, UnauthorizedHttpResult>> ConfirmEmail(
        [FromQuery] string userId,
        [FromQuery] string code,
        [FromQuery] string? changedEmail)
    {
        if (await userManager.FindByIdAsync(userId) is not { } user)
        {
            // We could respond with a 404 instead of a 401 like Identity UI, but that feels like unnecessary
            // information.
            return TypedResults.Unauthorized();
        }
    
        try
        {
            code = Encoding.UTF8.GetString(WebEncoders.Base64UrlDecode(code));
        }
        catch (FormatException)
        {
            return TypedResults.Unauthorized();
        }
    
        IdentityResult result;
    
        if (string.IsNullOrEmpty(changedEmail))
        {
            result = await userManager.ConfirmEmailAsync(user, code);
        }
        else
        {
            // As with Identity UI, email and user name are one and the same. So when we update the email,
            // we need to update the user name.
            result = await userManager.ChangeEmailAsync(user, changedEmail, code);
    
            if (result.Succeeded)
            {
                result = await userManager.SetUserNameAsync(user, changedEmail);
            }
        }
                
        if (!result.Succeeded)
            return TypedResults.Unauthorized();
    
        return TypedResults.Text("Email confirmed");
    }
        
    // [HttpPost("resendConfirmationEmail")]
    // public async Task<Ok> ResendConfirmationEmail(
    //     [FromBody] ResendConfirmationEmailModel resendConfirmationEmailModel,
    //     [FromServices] IServiceProvider serviceProvider)
    // {
    //     if (await userManager.FindByEmailAsync(resendConfirmationEmailModel.Email) is not { } user)
    //     {
    //         // Responding with 404 or similar would provide with unnecessary information
    //         return TypedResults.Ok();
    //     }
    //
    //     var emailSender = serviceProvider.GetRequiredService<IEmailSender>();
    //     await emailSender.SendAccountConfirmationMessageAsync(
    //         user, resendConfirmationEmailModel.Email, RoleName.CruiseManager, serviceProvider);
    //     return TypedResults.Ok();
    // }
    
    [Authorize]
    [HttpGet]
    public async Task<IActionResult> GetCurrentUser()
    {
        var userName = User.Identity!.Name!;
        var user = await userManager.FindByNameAsync(userName);
            
        if (user != null)
            return Ok(await userDtosService.CreateUserDto(user));
        return NotFound();
    }
    
    [Authorize]
    [HttpPatch]
    public async Task<IActionResult> ChangeAccountDetails(
        [FromBody] ChangeAccountDetailsModel changeAccountDetailsModel)
    {
        var userName = User.Identity!.Name!;
        var user = await userManager.FindByNameAsync(userName);
    
        if (user == null)
            return NotFound();
    
        if (changeAccountDetailsModel.NewFirstName != null)
            user.FirstName = changeAccountDetailsModel.NewFirstName;
        if (changeAccountDetailsModel.NewLastName != null)
            user.LastName = changeAccountDetailsModel.NewLastName;
        if (changeAccountDetailsModel.NewPassword != null)
        {
            if (changeAccountDetailsModel.Password == null)
                return BadRequest();
            var result = await userManager.ChangePasswordAsync(
                user, changeAccountDetailsModel.Password, changeAccountDetailsModel.NewPassword);
    
            if (result.Succeeded)
                return NoContent();
            return BadRequest();
        }
    
        await userManager.UpdateAsync(user);
        return NoContent();
    }
}