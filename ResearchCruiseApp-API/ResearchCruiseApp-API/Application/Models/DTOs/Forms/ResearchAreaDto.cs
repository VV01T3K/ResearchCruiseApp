using AutoMapper;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Application.Models.DTOs.Forms;


[JsonObject(NamingStrategyType = typeof (CamelCaseNamingStrategy))]
public class ResearchAreaDto(Guid id, string name)
{
    public Guid Id { get; set; } = id;
    public string Name { get; set; } = name;


    private class MapProfile : Profile
    {
        public MapProfile()
        {
            CreateMap<ResearchArea, ResearchAreaDto>();
        }
    }
}