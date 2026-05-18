using AutoMapper;
using ResearchCruiseApp.Api.Applications.Contracts;
using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Api.Applications.Factories.Photos;

internal class PhotosFactory(ICompressor compressor) : IPhotosFactory
{
    public async Task<Photo> Create(FileDto fileDto)
    {
        var photo = new Photo
        {
            Name = fileDto.Name,
            Content = await compressor.Compress(fileDto.Content),
        };

        return photo;
    }
}
