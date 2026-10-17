using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Api.Cruises;

internal static class CruiseConfirmationEmails
{
    // The message describes the cruise, not an application, so a manager or deputy of
    // several of its applications receives it once.
    public static async Task Send(
        Cruise cruise,
        IEnumerable<CruiseApplication> applications,
        EmailSender emailSender,
        IdentityService identityService
    )
    {
        var recipientIds = applications
            .SelectMany(application =>
                new[] { application.FormA!.DeputyManagerId, application.FormA.CruiseManagerId }
            )
            .Distinct();
        foreach (var recipientId in recipientIds)
        {
            var recipient = await identityService.GetUserDtoById(recipientId);
            if (recipient is not null)
            {
                await emailSender.SendCruiseConfirmMessage(cruise, recipient, recipient.Email);
            }
        }
    }
}
