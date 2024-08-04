namespace ResearchCruiseApp_API.Application.SharedServices.Compressor;


public interface ICompressor
{
    public Task<byte[]> CompressAsync(string input);

    public Task<string> Decompress(byte[] input);
}