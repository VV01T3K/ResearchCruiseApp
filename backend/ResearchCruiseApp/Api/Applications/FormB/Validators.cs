using FluentValidation;
using ResearchCruiseApp.Api.Applications.Shared;

namespace ResearchCruiseApp.Api.Applications;

public sealed class FormBWriteRequestValidator : AbstractValidator<FormBWriteRequest>
{
    public FormBWriteRequestValidator(FileInspector fileInspector)
    {
        var collections = new InlineValidator<FormBFields>();
        collections.RuleFor(fields => fields.Permissions).NotNull().ForEach(item => item.NotNull());
        collections.RuleFor(fields => fields.UgTeams).NotNull().ForEach(item => item.NotNull());
        collections.RuleFor(fields => fields.GuestTeams).NotNull().ForEach(item => item.NotNull());
        collections.RuleFor(fields => fields.CrewMembers).NotNull().ForEach(item => item.NotNull());
        collections
            .RuleFor(fields => fields.ShortResearchEquipments)
            .NotNull()
            .ForEach(item => item.NotNull());
        collections
            .RuleFor(fields => fields.LongResearchEquipments)
            .NotNull()
            .ForEach(item => item.NotNull());
        collections.RuleFor(fields => fields.Ports).NotNull().ForEach(item => item.NotNull());
        collections
            .RuleFor(fields => fields.CruiseDaysDetails)
            .NotNull()
            .ForEach(item => item.NotNull());
        collections
            .RuleFor(fields => fields.ResearchEquipments)
            .NotNull()
            .ForEach(item => item.NotNull());
        collections.RuleFor(fields => fields.ShipEquipmentsIds).NotNull();

        // Validate structure before rules that dereference collection entries.
        RuleFor(request => request.Form)
            .NotNull()
            .SetValidator(collections)
            .DependentRules(() =>
            {
                When(
                    request => request.Form is not null && !request.Draft,
                    () =>
                    {
                        RuleForEach(request => request.Form.Permissions)
                            .Must(permissionFields => permissionFields.Scan is not null)
                            .WithMessage(
                                "Na etapie Formularza B wymagane jest przesłanie skanów pozwoleń."
                            );

                        RuleForEach(request => request.Form.Permissions)
                            .Must(permissionFields =>
                                permissionFields.Scan is not null
                                && fileInspector.IsFilePdf(permissionFields.Scan.Content)
                            )
                            .WithMessage("Skan pozwolenia musi być plikiem PDF.");

                        RuleForEach(request => request.Form.Permissions)
                            .Must(permissionFields =>
                                permissionFields.Scan is not null
                                && fileInspector.IsFileSizeValid(
                                    permissionFields.Scan.Content,
                                    PermissionScanLimits.MaxFileSize
                                )
                            )
                            .WithMessage("Rozmiar skanu pozwolenia nie może przekraczać 2 MiB.");
                    }
                );
            });
    }
}
