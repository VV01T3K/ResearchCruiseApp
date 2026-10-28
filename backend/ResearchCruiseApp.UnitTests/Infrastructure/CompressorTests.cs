using System.Buffers.Binary;
using System.IO.Compression;
using System.Text;
using ResearchCruiseApp.Infrastructure.Files;

namespace ResearchCruiseApp.UnitTests.Infrastructure;

public sealed class CompressorTests
{
    private const string Input = "data:application/pdf;base64,JVBERi0xLjQK";

    [Theory]
    [InlineData(Input)]
    [InlineData("")]
    public async Task Compress_WritesGzipTrailer(string input)
    {
        var compressed = await new Compressor().Compress(input);

        Assert.Equal(
            (uint)Encoding.UTF8.GetByteCount(input),
            BinaryPrimitives.ReadUInt32LittleEndian(compressed.AsSpan(^4))
        );
        Assert.Equal(input, await new Compressor().Decompress(compressed));
    }

    [Fact]
    public async Task Decompress_ReadsEmptyPayload()
    {
        Assert.Equal("", await new Compressor().Decompress([]));
    }

    [Fact]
    public async Task Decompress_ReadsPayloadWithoutTrailer()
    {
        using var outputStream = new MemoryStream();
        await using var gZipStream = new GZipStream(outputStream, CompressionMode.Compress);
        await gZipStream.WriteAsync(
            Encoding.UTF8.GetBytes(Input),
            TestContext.Current.CancellationToken
        );
        await gZipStream.FlushAsync(TestContext.Current.CancellationToken);

        Assert.Equal(Input, await new Compressor().Decompress(outputStream.ToArray()));
    }
}
