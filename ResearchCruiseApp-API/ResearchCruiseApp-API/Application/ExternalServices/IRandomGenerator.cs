namespace ResearchCruiseApp_API.Application.ExternalServices;


public interface IRandomGenerator
{
    byte[] CreateSecureCodeBytes();
}