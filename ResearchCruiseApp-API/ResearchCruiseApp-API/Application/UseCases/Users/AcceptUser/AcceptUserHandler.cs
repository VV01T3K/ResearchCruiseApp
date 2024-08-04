using MediatR;
using Microsoft.AspNetCore.Identity;
using ResearchCruiseApp_API.Application.Common.Models.ServiceResult;
using ResearchCruiseApp_API.Application.ExternalServices;
using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Application.UseCases.Users.AcceptUser;


public class AcceptUserHandler(
    UserManager<User> userManager,
    IEmailSender emailSender)
    : IRequestHandler<AcceptUserCommand, Result>
{
    public async Task<Result> Handle(AcceptUserCommand request, CancellationToken cancellationToken)
    {
        var user = await userManager.FindByIdAsync(request.Id.ToString());
        if (user == null)
            return Error.NotFound();
            
        user.Accepted = true;
        await userManager.UpdateAsync(user);

        await emailSender.SendAccountAcceptedMessageAsync(user);

        return Result.Empty;
    }
}