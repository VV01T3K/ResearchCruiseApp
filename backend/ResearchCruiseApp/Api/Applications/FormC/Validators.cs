using FluentValidation;
using ResearchCruiseApp.Api.Applications.Shared;
using ResearchCruiseApp.Domain;

namespace ResearchCruiseApp.Api.Applications;

public sealed class FormCWriteRequestValidator : AbstractValidator<FormCWriteRequest>
{
    public FormCWriteRequestValidator(FileInspector fileInspector)
    {
        var collections = new InlineValidator<FormCFields>();
        collections.Include(new StorageValidator<FormCFields>());
        collections
            .RuleFor(fields => fields.Permissions)
            .NotNull()
            .ForEach(item =>
                item.NotNull()
                    .ChildRules(permission =>
                    {
                        // A null scan remains an incomplete draft; validate fields when an upload exists.
                        permission
                            .RuleFor(fields => fields.Scan!)
                            .SetValidator(new UploadFieldsValidator());
                    })
            );
        collections
            .RuleFor(fields => fields.ResearchAreaDescriptions)
            .NotNull()
            .ForEach(item => item.NotNull());
        collections.RuleFor(fields => fields.UgTeams).NotNull().ForEach(item => item.NotNull());
        collections.RuleFor(fields => fields.GuestTeams).NotNull().ForEach(item => item.NotNull());
        collections
            .RuleFor(fields => fields.ResearchTasksEffects)
            .NotNull()
            .ForEach(item =>
                item.NotNull()
                    .ChildRules(task =>
                        task.RuleFor(fields => fields.Type)
                            .Must(value =>
                                Enum.TryParse<ResearchTaskType>(value, out var type)
                                && Enum.IsDefined(type)
                            )
                            .WithMessage("Podany typ zadania jest nieprawidłowy.")
                    )
            );
        collections
            .RuleFor(fields => fields.Contracts)
            .NotNull()
            .ForEach(item =>
                item.NotNull()
                    .ChildRules(contract =>
                    {
                        contract
                            .RuleFor(fields => fields.Scans)
                            .NotNull()
                            .ForEach(scan =>
                                scan.NotNull().SetValidator(new UploadFieldsValidator())
                            );
                    })
            );
        collections.RuleFor(fields => fields.SpubTasks).NotNull().ForEach(item => item.NotNull());
        collections
            .RuleFor(fields => fields.ShortResearchEquipments)
            .NotNull()
            .ForEach(item => item.NotNull());
        collections
            .RuleFor(fields => fields.LongResearchEquipments)
            .NotNull()
            .ForEach(item =>
                item.NotNull()
                    .ChildRules(equipment =>
                        equipment
                            .RuleFor(fields => fields.Action)
                            .Must(value =>
                                Enum.TryParse<ResearchEquipmentAction>(value, out var action)
                                && Enum.IsDefined(action)
                            )
                            .WithMessage("Podany rodzaj operacji sprzętu jest nieprawidłowy.")
                    )
            );
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
        collections
            .RuleFor(fields => fields.CollectedSamples)
            .NotNull()
            .ForEach(item => item.NotNull());
        collections
            .RuleFor(fields => fields.Photos)
            .NotNull()
            .ForEach(item => item.NotNull().SetValidator(new UploadFieldsValidator()));

        collections
            .RuleForEach(fields => fields.Permissions)
            .SetValidator(new StorageValidator<PermissionFields>());
        collections
            .RuleForEach(fields => fields.UgTeams)
            .SetValidator(new StorageValidator<UgTeamFields>());
        collections
            .RuleForEach(fields => fields.GuestTeams)
            .SetValidator(new StorageValidator<GuestTeamFields>());
        collections
            .RuleForEach(fields => fields.ResearchAreaDescriptions)
            .SetValidator(new StorageValidator<ResearchAreaSelection>());
        collections
            .RuleForEach(fields => fields.ResearchTasksEffects)
            .SetValidator(new StorageValidator<ResearchTaskEffectFields>());
        collections
            .RuleForEach(fields => fields.Contracts)
            .SetValidator(new StorageValidator<ContractFields>());
        collections
            .RuleForEach(fields => fields.SpubTasks)
            .SetValidator(new StorageValidator<SpubTaskFields>());
        collections
            .RuleForEach(fields => fields.ShortResearchEquipments)
            .SetValidator(new StorageValidator<ShortTermResearchEquipmentFields>());
        collections
            .RuleForEach(fields => fields.LongResearchEquipments)
            .SetValidator(new StorageValidator<LongTermResearchEquipmentFields>());
        collections
            .RuleForEach(fields => fields.Ports)
            .SetValidator(new StorageValidator<PortCallFields>());
        collections
            .RuleForEach(fields => fields.CruiseDaysDetails)
            .SetValidator(new StorageValidator<CruiseDayFields>());
        collections
            .RuleForEach(fields => fields.ResearchEquipments)
            .SetValidator(new StorageValidator<ResearchEquipmentFields>());
        collections
            .RuleForEach(fields => fields.CollectedSamples)
            .SetValidator(new StorageValidator<CollectedSampleFields>());

        RuleFor(request => request.Form)
            .NotNull()
            .SetValidator(collections)
            .DependentRules(() =>
            {
                When(
                    request => request.Form is not null,
                    () =>
                    {
                        RuleForEach(request => request.Form.ResearchTasksEffects)
                            .Must(effect =>
                                string.IsNullOrEmpty(effect.PublicationMinisterialPoints)
                                || (
                                    int.TryParse(
                                        effect.PublicationMinisterialPoints,
                                        out var points
                                    )
                                    && points >= 0
                                )
                            )
                            .WithMessage("Punkty publikacji muszą być nieujemną liczbą całkowitą.");

                        RuleForEach(request => request.Form.ResearchTasksEffects)
                            .Must(effect =>
                                IsBooleanOrEmpty(effect.Done)
                                && IsBooleanOrEmpty(effect.ManagerConditionMet)
                                && IsBooleanOrEmpty(effect.DeputyConditionMet)
                            )
                            .WithMessage(
                                "Warunki efektu muszą mieć wartość true, false lub pusty ciąg."
                            );
                    }
                );
                When(
                    request => request.Form is not null && !request.Draft,
                    () =>
                    {
                        RuleForEach(request => request.Form.Permissions)
                            .Must(permissionFields => permissionFields.Scan is not null)
                            .WithMessage(
                                "Na etapie Formularza C wymagane jest przesłanie skanów pozwoleń."
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

    private static bool IsBooleanOrEmpty(string? value) =>
        value == ""
        || string.Equals(value, "true", StringComparison.OrdinalIgnoreCase)
        || string.Equals(value, "false", StringComparison.OrdinalIgnoreCase);
}
