using FluentValidation;
using ResearchCruiseApp.Api.Applications.Shared;

namespace ResearchCruiseApp.Api.Applications;

internal sealed class UploadFieldsValidator : AbstractValidator<FileContent>
{
    public UploadFieldsValidator()
    {
        RuleFor(file => file.Name).NotNull().MaximumLength(1024);
        RuleFor(file => file.Content).NotNull();
    }
}
