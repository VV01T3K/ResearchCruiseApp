using ResearchCruiseApp.Api.Applications.Shared;
using ResearchCruiseApp.Infrastructure.Files;

namespace ResearchCruiseApp.UnitTests.Infrastructure;

public sealed class PermissionScanTests
{
    // BE-FILE-001: recognize the supported PDF signature encodings and reject malformed content.
    [Theory]
    [InlineData("JVBERi0xLjcK", true)]
    [InlineData("data:application/pdf;base64,JVBERi0xLjcK", true)]
    [InlineData("data:image/png;base64,iVBORw0KGgo=", false)]
    [InlineData("aGVsbG8=", false)]
    [InlineData("JVBE", false)]
    [InlineData("not base64!", false)]
    [InlineData("", false)]
    public void InspectPdf_WhenHeaderOrEncodingVaries_RecognizesOnlyPdfSignature(
        string content,
        bool expected
    )
    {
        Assert.Equal(expected, new FileInspector().IsFilePdf(content));
    }

    // BE-FILE-002: documented limit is two MiB of decoded data, not encoded text length.
    [Theory]
    [InlineData(2_097_151, true)]
    [InlineData(2_097_152, true)]
    [InlineData(2_097_153, false)]
    public void InspectSize_WhenDecodedPayloadReachesLimit_UsesInclusiveTwoMiBBoundary(
        int bytes,
        bool expected
    )
    {
        var encoded = Convert.ToBase64String(new byte[bytes]);
        Assert.Equal(
            expected,
            new FileInspector().IsFileSizeValid(encoded, PermissionScanLimits.MaxFileSize)
        );
        Assert.Equal(
            expected,
            new FileInspector().IsFileSizeValid(
                "data:application/pdf;base64," + encoded,
                PermissionScanLimits.MaxFileSize
            )
        );
    }

    [Fact]
    public void InspectSize_WhenEncodingIsInvalid_RejectsPayload()
    {
        Assert.False(
            new FileInspector().IsFileSizeValid("not base64!", PermissionScanLimits.MaxFileSize)
        );
    }
}
