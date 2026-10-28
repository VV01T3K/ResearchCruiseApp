using System.Buffers.Binary;
using System.IO.Compression;
using System.Text;
using ResearchCruiseApp.Infrastructure.Files;

namespace ResearchCruiseApp.UnitTests.Infrastructure;

public sealed class CompressorTests
{
    private const string Input = "data:application/pdf;base64,JVBERi0xLjQK";

    [Fact]
    public async Task Compress_WritesGzipTrailer()
    {
        var compressed = await new Compressor().Compress(Input);

        Assert.Equal(
            (uint)Encoding.UTF8.GetByteCount(Input),
            BinaryPrimitives.ReadUInt32LittleEndian(compressed.AsSpan(^4))
        );
        Assert.Equal(Input, await new Compressor().Decompress(compressed));
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
