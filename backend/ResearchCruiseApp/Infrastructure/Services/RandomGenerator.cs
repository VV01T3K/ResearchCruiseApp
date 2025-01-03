using System.Security.Cryptography;
using ResearchCruiseApp.Application.ExternalServices;

namespace ResearchCruiseApp.Infrastructure.Services;

internal class RandomGenerator : IRandomGenerator
{
    private const int SecureCodeBytesSize = 512;
    private const int SecurePasswordBytesSize = 16;

    public byte[] CreateSecureCodeBytes()
    {
        return GetRandomBytes(SecureCodeBytesSize);
    }

    public string CreateSecurePassword()
    {
        var passwordBytes = GetRandomBytes(SecurePasswordBytesSize);
        return Convert.ToBase64String(passwordBytes);
    }

    private static byte[] GetRandomBytes(int size)
    {
        var bytes = new byte[size];

        using var numberGenerator = RandomNumberGenerator.Create();
        numberGenerator.GetBytes(bytes);

        return bytes;
    }
}
