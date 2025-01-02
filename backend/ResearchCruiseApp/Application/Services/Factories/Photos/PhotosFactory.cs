using AutoMapper;
using ResearchCruiseApp.Application.ExternalServices;
using ResearchCruiseApp.Application.Models.DTOs.CruiseApplications;
using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Application.Services.Factories.Photos;


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