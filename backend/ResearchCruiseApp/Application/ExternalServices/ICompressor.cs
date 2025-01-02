namespace ResearchCruiseApp.Application.ExternalServices;


public interface ICompressor
{
    public Task<byte[]> Compress(string input);

    public Task<string> Decompress(byte[] input);
}