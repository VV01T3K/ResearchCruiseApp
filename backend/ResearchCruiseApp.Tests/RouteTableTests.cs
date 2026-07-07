using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.AspNetCore.Routing;
using Microsoft.Extensions.DependencyInjection;
using Xunit;

namespace ResearchCruiseApp.Tests;

public sealed class RouteTableTests
{
    private static readonly string[] ExpectedRoutes =
    [
        "* /health",
        "DELETE /v2/account/publications",
        "DELETE /v2/account/publications/{publicationId:guid}",
        "DELETE /v2/cruises/{cruiseId:guid}",
        "DELETE /v2/cruises/{cruiseId:guid}/confirmation",
        "DELETE /v2/users/{userId:guid}",
        "DELETE /v2/users/{userId:guid}/acceptance",
        "DELETE /v2/users/{userId:guid}/roles/{roleName}",
        "GET /v2/account/cruise-effects",
        "GET /v2/account/me",
        "GET /v2/account/publications",
        "GET /v2/applications/",
        "GET /v2/applications/{applicationId:guid}",
        "GET /v2/applications/{applicationId:guid}/cruise",
        "GET /v2/applications/{applicationId:guid}/evaluation",
        "GET /v2/applications/{applicationId:guid}/form-a",
        "GET /v2/applications/{applicationId:guid}/form-b",
        "GET /v2/applications/{applicationId:guid}/form-c",
        "GET /v2/applications/{applicationId:guid}/supervisor-review",
        "GET /v2/applications/for-cruise-planning",
        "GET /v2/applications/form-a/context",
        "GET /v2/applications/form-b/context",
        "GET /v2/auth/confirm-email",
        "GET /v2/cruises/",
        "GET /v2/cruises/{cruiseId:guid}",
        "GET /v2/cruises/blockades",
        "GET /v2/cruises/export",
        "GET /v2/users/",
        "GET /v2/users/available-cruise-managers",
        "GET /version",
        "PATCH /v2/account/me/password",
        "PATCH /v2/cruises/{cruiseId:guid}",
        "PATCH /v2/users/{userId:guid}",
        "POST /v2/account/publications/import",
        "POST /v2/applications/",
        "POST /v2/auth/login",
        "POST /v2/auth/password-reset",
        "POST /v2/auth/password-reset-request",
        "POST /v2/auth/refresh",
        "POST /v2/auth/register",
        "POST /v2/auth/resend-confirmation-email",
        "POST /v2/cruises/",
        "POST /v2/cruises/auto-plan",
        "POST /v2/users/",
        "PUT /v2/applications/{applicationId:guid}/decision",
        "PUT /v2/applications/{applicationId:guid}/form-a",
        "PUT /v2/applications/{applicationId:guid}/form-b",
        "PUT /v2/applications/{applicationId:guid}/form-b/refill",
        "PUT /v2/applications/{applicationId:guid}/form-c",
        "PUT /v2/applications/{applicationId:guid}/form-c/refill",
        "PUT /v2/applications/{applicationId:guid}/supervisor-review/decision",
        "PUT /v2/cruises/{cruiseId:guid}/completion",
        "PUT /v2/cruises/{cruiseId:guid}/confirmation",
        "PUT /v2/users/{userId:guid}/acceptance",
        "PUT /v2/users/{userId:guid}/roles/{roleName}",
    ];

    [Fact]
    public void RouteTableMatchesThePinnedContract()
    {
        using var factory = new WebApplicationFactory<Program>().WithWebHostBuilder(builder =>
            builder.UseEnvironment("Testing")
        );

        var endpointDataSource = factory.Services.GetRequiredService<EndpointDataSource>();
        var actualRoutes = endpointDataSource
            .Endpoints.OfType<RouteEndpoint>()
            .SelectMany(endpoint =>
            {
                var methods = endpoint.Metadata.GetMetadata<HttpMethodMetadata>()?.HttpMethods;
                var route = endpoint.RoutePattern.RawText!.Replace(
                    "/v{version:apiVersion}",
                    "/v2",
                    StringComparison.Ordinal
                );
                return methods is { Count: > 0 }
                    ? methods.Select(method => $"{method} {route}")
                    : [$"* {route}"];
            })
            .Order()
            .ToArray();

        Assert.Equal(ExpectedRoutes.Order(), actualRoutes);
    }
}
