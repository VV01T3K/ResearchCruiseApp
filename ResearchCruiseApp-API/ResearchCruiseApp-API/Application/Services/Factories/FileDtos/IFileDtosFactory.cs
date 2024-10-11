using ResearchCruiseApp_API.Application.Models.DTOs.CruiseApplications;

namespace ResearchCruiseApp_API.Application.Services.Factories.FileDtos;


public interface IFileDtosFactory
{
    Task<FileDto> Create(string filename, byte[] fileContentCompressed);
}