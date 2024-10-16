using AutoMapper;
using ResearchCruiseApp_API.Application.ExternalServices;
using ResearchCruiseApp_API.Application.Models.DTOs.CruiseApplications;
using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Application.Services.Factories.Photos;


internal class PhotosFactory(ICompressor compressor) : IPhotosFactory
{
    public async Task<Photo> Create(FileDto fileDto)
    {
        var photo = new Photo
        {
            Name = fileDto.Name,
            Content = await compressor.Compress(fileDto.Content)
        };

        return photo;
    }
}