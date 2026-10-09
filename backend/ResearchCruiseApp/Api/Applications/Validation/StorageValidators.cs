using System.ComponentModel.DataAnnotations;
using System.Linq.Expressions;
using System.Reflection;
using FluentValidation;

namespace ResearchCruiseApp.Api.Applications;

// Rejects strings the database cannot store: [StringLength] limits and C# non-nullable
// strings map to column sizes and NOT NULL. Applies to drafts too, so they fail with 400, not 500.
internal sealed class StorageValidator<T> : AbstractValidator<T>
{
    public StorageValidator()
    {
        var nullability = new NullabilityInfoContext();
        foreach (
            var property in typeof(T).GetProperties().Where(p => p.PropertyType == typeof(string))
        )
        {
            var parameter = Expression.Parameter(typeof(T));
            var rule = RuleFor(
                Expression.Lambda<Func<T, string?>>(
                    Expression.Property(parameter, property),
                    parameter
                )
            );
            if (nullability.Create(property).WriteState == NullabilityState.NotNull)
                rule.NotNull();
            if (property.GetCustomAttribute<StringLengthAttribute>() is { } length)
                rule.MaximumLength(length.MaximumLength);
        }
    }
}
