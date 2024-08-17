namespace ResearchCruiseApp_API.Application.SharedServices.Compressor;


public interface ICompressor
{
    public Task<byte[]> Compress(string input);

    public Task<string> Decompress(byte[] input);
}