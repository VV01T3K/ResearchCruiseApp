namespace ResearchCruiseApp.Infrastructure.Files;

public interface ICompressor
{
    public Task<byte[]> Compress(string input);

    public Task<string> Decompress(byte[] input);
}
