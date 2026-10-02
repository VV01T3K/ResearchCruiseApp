using System.Linq.Expressions;
using System.Reflection;
using System.Runtime.CompilerServices;
using System.Text.Json;
using System.Text.RegularExpressions;
using FluentValidation;
using FluentValidation.Internal;

namespace ResearchCruiseApp.Infrastructure.Api;

internal static partial class ValidationPropertyNames
{
    // Validation errors are keyed by the camelCase JSON paths clients send, e.g. form.permissions[0].
    // A module initializer applies this before any validator is built, in the app and in tests.
    [ModuleInitializer]
    internal static void UseJsonPropertyPaths()
    {
        ValidatorOptions.Global.PropertyNameResolver = (_, member, expression) =>
        {
            var path = GetMemberPath(member, expression);
            return path is null
                ? null
                : string.Join('.', path.Split('.').Select(JsonNamingPolicy.CamelCase.ConvertName));
        };
        // Default messages keep FluentValidation's readable names, e.g. 'First Name'.
        ValidatorOptions.Global.DisplayNameResolver = (_, member, expression) =>
            GetMemberPath(member, expression) is { } path ? SplitPascalCase(path) : null;
    }

    private static string? GetMemberPath(MemberInfo? member, LambdaExpression? expression)
    {
        var chain = expression is null ? null : PropertyChain.FromExpression(expression);
        return chain is { Count: > 0 } ? chain.ToString() : member?.Name;
    }

    private static string SplitPascalCase(string path) =>
        WordBoundary().Replace(path.Replace('.', ' '), " ");

    [GeneratedRegex("(?<=[a-z0-9])(?=[A-Z])")]
    private static partial Regex WordBoundary();
}
