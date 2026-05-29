using System.Text;
using System.Text.RegularExpressions;
using Microsoft.AspNetCore.Mvc;

namespace ResearchCruiseApp.Web.Controllers;

/// <summary>
/// Relays browser Sentry envelopes through the API to avoid ad-blockers (see Sentry tunnel docs).
/// </summary>
[ApiController]
[Route("api/sentry-tunnel")]
public sealed partial class SentryTunnelController : ControllerBase
{
    private static readonly Regex DsnPattern = DsnRegex();

    private readonly IHttpClientFactory _httpClientFactory;
    private readonly string? _envelopeEndpoint;

    public SentryTunnelController(IHttpClientFactory httpClientFactory, IConfiguration configuration)
    {
        _httpClientFactory = httpClientFactory;
        _envelopeEndpoint = ResolveEnvelopeEndpoint(configuration["Sentry:Dsn"]);
    }

    [HttpPost]
    public async Task<IActionResult> Relay(CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(_envelopeEndpoint))
        {
            return NotFound();
        }

        using var reader = new StreamReader(Request.Body, Encoding.UTF8);
        var body = await reader.ReadToEndAsync(cancellationToken);

        var client = _httpClientFactory.CreateClient(nameof(SentryTunnelController));
        using var content = new StringContent(body, Encoding.UTF8, "application/x-sentry-envelope");
        using var response = await client.PostAsync(_envelopeEndpoint, content, cancellationToken);

        return StatusCode((int)response.StatusCode);
    }

    private static string? ResolveEnvelopeEndpoint(string? dsn)
    {
        if (string.IsNullOrWhiteSpace(dsn))
        {
            return null;
        }

        var match = DsnPattern.Match(dsn);
        if (!match.Success)
        {
            return null;
        }

        var host = match.Groups["host"].Value;
        var projectId = match.Groups["project"].Value;
        return $"https://{host}/api/{projectId}/envelope/";
    }

    [GeneratedRegex(@"^https?://[^@]+@(?<host>[^/]+)/(?<project>[^/]+)/?$", RegexOptions.IgnoreCase)]
    private static partial Regex DsnRegex();
}
