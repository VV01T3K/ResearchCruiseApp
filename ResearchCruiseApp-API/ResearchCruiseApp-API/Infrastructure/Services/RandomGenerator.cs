using System.Security.Cryptography;
using ResearchCruiseApp_API.Application.ExternalServices;

namespace ResearchCruiseApp_API.Infrastructure.Services;


internal class RandomGenerator : IRandomGenerator
{
    public byte[] CreateSecureCodeBytes()
    {
        const int secureCodeBytesSize = 512;
        var codeBytes = new byte[secureCodeBytesSize];

        using var numberGenerator = RandomNumberGenerator.Create();
        numberGenerator.GetBytes(codeBytes);

        return codeBytes;
    }
}