namespace ResearchCruiseApp.Infrastructure.Security;

public interface IRandomGenerator
{
    byte[] CreateSecureCodeBytes();
    string CreateSecurePassword();
}
