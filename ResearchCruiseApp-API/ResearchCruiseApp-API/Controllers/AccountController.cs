using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;
using System.Diagnostics;
using System.Text;
using Microsoft.AspNetCore.Authentication.BearerToken;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.Extensions.Options;
using ResearchCruiseApp_API.Data;
using ResearchCruiseApp_API.Models;
using ResearchCruiseApp_API.Models.AuthenticationModels;
using ResearchCruiseApp_API.Types;

namespace ResearchCruiseApp_API.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class AccountController(UserManager<User> userManager) : ControllerBase
    {
        private readonly EmailAddressAttribute _emailAddressAttribute = new();
        
        
        [HttpPost("register")]
        public async Task<Results<Ok, ValidationProblem>> Register(
            [FromBody] RegisterModel registerModel,
            [FromServices] IServiceProvider serviceProvider)
        {
            if (!userManager.SupportsUserEmail)
            {
                throw new NotSupportedException($"{nameof(Register)} requires a user store with email support.");
            }

            var userStore = serviceProvider.GetRequiredService<IUserStore<User>>();
            var emailStore = (IUserEmailStore<User>)userStore;
            var email = registerModel.Email;

            if (string.IsNullOrEmpty(email) || !_emailAddressAttribute.IsValid(email))
            {
                return CreateValidationProblem(IdentityResult.Failed(userManager.ErrorDescriber.InvalidEmail(email)));
            }

            var user = new User();
            await userStore.SetUserNameAsync(user, email, CancellationToken.None);
            await emailStore.SetEmailAsync(user, email, CancellationToken.None);
            user.FirstName = registerModel.FirstName;
            user.LastName = registerModel.LastName;
            
            var result = await userManager.CreateAsync(user, registerModel.Password);
            await userManager.AddToRoleAsync(user, RoleName.CruiseManager);
            
            if (!result.Succeeded)
            {
                return CreateValidationProblem(result);
            }
            
            await SendConfirmationEmailAsync(user, serviceProvider, HttpContext);
            return TypedResults.Ok();
        }
        
        [HttpPost("login")]
        public async Task<Results<Ok<AccessTokenResponse>, EmptyHttpResult, ProblemHttpResult>> Login(
            [FromBody] LoginModel loginModel,
            [FromServices] IServiceProvider serviceProvider)
        {
            var user = await userManager.FindByEmailAsync(loginModel.Email);
            if (user is { Accepted: false })
            {
                return TypedResults.Problem(statusCode: StatusCodes.Status401Unauthorized);
            }
            
            var signInManager = serviceProvider.GetRequiredService<SignInManager<User>>();
            const bool isPersistent = false;
            
            signInManager.AuthenticationScheme = IdentityConstants.BearerScheme;
            var result = await signInManager.PasswordSignInAsync(
                loginModel.Email, loginModel.Password, isPersistent, lockoutOnFailure: true);
            
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

            return TypedResults.Text("Thank you for confirming your email.");
        }
        
        [HttpPost("resendConfirmationEmail")]
        public async Task<Ok> ResendConfirmationEmail(
            [FromBody] ResendConfirmationEmailModel resendConfirmationEmailModel,
            [FromServices] IServiceProvider serviceProvider)
        {
            if (await userManager.FindByEmailAsync(resendConfirmationEmailModel.Email) is not { } user)
            {
                // Responding with 404 or similar would provide with unnecessary information
                return TypedResults.Ok();
            }

            await SendConfirmationEmailAsync(user, serviceProvider, HttpContext);
            return TypedResults.Ok();
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
        
        private async Task SendConfirmationEmailAsync(
            User user,
            IServiceProvider serviceProvider,
            HttpContext context,
            bool changeEmail = false)
        {
            var emailSender = serviceProvider.GetRequiredService<IEmailSender<User>>();
            var emailConfirmationMessageBody = await GenerateEmailConfirmationMessageBody(
                user, changeEmail, serviceProvider.GetRequiredService<IConfiguration>());
            
            await emailSender.SendConfirmationLinkAsync(user, user.Email!, emailConfirmationMessageBody);
        }

        private async Task<string> GenerateEmailConfirmationMessageBody(
            User user, bool isChange, IConfiguration configuration)
        {
            var code = isChange ?
                await userManager.GenerateChangeEmailTokenAsync(user, user.Email!) : 
                await userManager.GenerateEmailConfirmationTokenAsync(user);
            code = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(code));
            var userId = await userManager.GetUserIdAsync(user);
            var protocol = configuration.GetSection("ProtocolUsed").Value;
            var frontendUrl = configuration.GetSection("FrontendUrl").Value;
            
            string link = $"{protocol}://{frontendUrl}/confirmEmail?userId={userId}&code={code}";
            if (isChange)
            {
                // This is validated by the /confirmEmail endpoint on change.
                link += $"&changedEmail={user.Email}";
            }
            
            string body = $"{user.FirstName} {user.LastName},<br/><br/>" +
                          $"witaj w systemie rejsów badawczych Biura Armatora Uniwersytetu.<br/>" +
                          $"Aby potwierdzić rejestrację konta, kliknij poniższy link:<br/><br/>" +
                          $"{link}.<br/><br/>" +
                          $"Pozdrawiamy<br/>" +
                          $"Biuro Armatora Uniwersytetu";
            return body;
        }
    }
}
