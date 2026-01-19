using System.Security.Cryptography;
using ResearchCruiseApp.Application.ExternalServices;

namespace ResearchCruiseApp.Infrastructure.Services;

internal class RandomGenerator : IRandomGenerator
{
    private const int SecureCodeBytesSize = 512;
    private const int SecurePasswordLength = 24;
    private const string Upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    private const string Lower = "abcdefghijklmnopqrstuvwxyz";
    private const string Digits = "0123456789";
    private const string Special = "!@#$%^&*()-_=+";

    public byte[] CreateSecureCodeBytes()
    {
        return GetRandomBytes(SecureCodeBytesSize);
    }

    public string CreateSecurePassword()
    {
        const string All = Upper + Lower + Digits + Special;
        Span<char> password = stackalloc char[SecurePasswordLength];

        // ensure characters are taken from each category
        password[0] = GetRandomChar(Upper);
        password[1] = GetRandomChar(Lower);
        password[2] = GetRandomChar(Digits);
        password[3] = GetRandomChar(Special);

        // fill rest
        RandomNumberGenerator.GetItems(All.AsSpan(), password[4..]);
        RandomNumberGenerator.Shuffle(password);
        return new string(password);

        static char GetRandomChar(string charset) =>
            charset[RandomNumberGenerator.GetInt32(charset.Length)];
    }

    private static byte[] GetRandomBytes(int size)
    {
        var bytes = new byte[size];

        using var numberGenerator = RandomNumberGenerator.Create();
        numberGenerator.GetBytes(bytes);

        return bytes;
    }
}
