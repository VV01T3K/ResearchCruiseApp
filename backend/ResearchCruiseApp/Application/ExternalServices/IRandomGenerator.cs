namespace ResearchCruiseApp.Application.ExternalServices;

public interface IRandomGenerator
{
    byte[] CreateSecureCodeBytes();
    string CreateSecurePassword();
}
