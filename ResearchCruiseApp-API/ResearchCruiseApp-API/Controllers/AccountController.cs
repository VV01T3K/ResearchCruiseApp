using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;
using System.Diagnostics;
using Microsoft.AspNetCore.Authentication.BearerToken;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using ResearchCruiseApp_API.Data;
using ResearchCruiseApp_API.Models;
using ResearchCruiseApp_API.Models.AuthenticationRequestsModels;

namespace ResearchCruiseApp_API.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class AccountController(UserManager<User> userManager) : ControllerBase
    {
        private readonly EmailAddressAttribute _emailAddressAttribute = new();
        
        
        [HttpPost("register")]
        public async Task<Results<Ok, ValidationProblem>> Register(
            [FromBody] RegistrationModel registrationModel, [FromServices] IServiceProvider serviceProvider)
        {
            if (!userManager.SupportsUserEmail)
            {
                throw new NotSupportedException($"{nameof(Register)} requires a user store with email support.");
            }

            var userStore = serviceProvider.GetRequiredService<IUserStore<User>>();
            var emailStore = (IUserEmailStore<User>)userStore;
            var email = registrationModel.Email;

            if (string.IsNullOrEmpty(email) || !_emailAddressAttribute.IsValid(email))
            {
                return CreateValidationProblem(IdentityResult.Failed(userManager.ErrorDescriber.InvalidEmail(email)));
            }

            var user = new User();
            await userStore.SetUserNameAsync(user, email, CancellationToken.None);
            await emailStore.SetEmailAsync(user, email, CancellationToken.None);
            user.FirstName = registrationModel.FirstName;
            user.LastName = registrationModel.LastName;
            
            var result = await userManager.CreateAsync(user, registrationModel.Password);
            await userManager.AddToRoleAsync(user, "CruiseManager");
            
            if (!result.Succeeded)
            {
                return CreateValidationProblem(result);
            }

            // await SendConfirmationEmailAsync(user, userManager, context, email);
            return TypedResults.Ok();
        }
        
        [HttpPost("login")]
        public async Task<Results<Ok<AccessTokenResponse>, EmptyHttpResult, ProblemHttpResult>> Login(
            [FromBody] LoginModel loginModel, [FromServices] IServiceProvider serviceProvider)
        {
            var signInManager = serviceProvider.GetRequiredService<SignInManager<User>>();
            const bool isPersistent = false;
            
            signInManager.AuthenticationScheme = IdentityConstants.BearerScheme;
            var result = await signInManager.PasswordSignInAsync(
                loginModel.Email, loginModel.Password, isPersistent, lockoutOnFailure: true);
            
            if (!result.Succeeded)
                return TypedResults.Problem(result.ToString(), statusCode: StatusCodes.Status401Unauthorized);

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
                await signInManager.ValidateSecurityStampAsync(refreshTicket.Principal) is not User user)
            {
                return TypedResults.Challenge();
            }

            var newPrincipal = await signInManager.CreateUserPrincipalAsync(user);
            return TypedResults.SignIn(newPrincipal, authenticationScheme: IdentityConstants.BearerScheme);
        }

        [Authorize]
        [HttpGet]
        public async Task<IActionResult> GetCurrentUser()
        {
            var userName = User.Identity!.Name!;
            var user = await userManager.FindByNameAsync(userName);
            
            if (user != null)
                return Ok(await UserModel.GetUserModel(user, userManager));
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
        
        
        private static ValidationProblem CreateValidationProblem(IdentityResult result)
        {
            // We expect a single error code and description in the normal case.
            // This could be golfed with GroupBy and ToDictionary, but perf! :P
            Debug.Assert(!result.Succeeded);
            var errorDictionary = new Dictionary<string, string[]>(1);

            foreach (var error in result.Errors)
            {
                string[] newDescriptions;

                if (errorDictionary.TryGetValue(error.Code, out var descriptions))
                {
                    newDescriptions = new string[descriptions.Length + 1];
                    Array.Copy(descriptions, newDescriptions, descriptions.Length);
                    newDescriptions[descriptions.Length] = error.Description;
                }
                else
                {
                    newDescriptions = [error.Description];
                }

                errorDictionary[error.Code] = newDescriptions;
            }

            return TypedResults.ValidationProblem(errorDictionary);
        }
    }
}
