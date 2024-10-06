using AutoMapper;
using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Application.Models.DTOs.CruiseApplications;


public class FormAContractDto
{
    public Guid Id { get; init; }

    public ContractDto Contract { get; set; } = null!;
    
    public string Points { get; init; }


    private class MapProfile : Profile
    {
        public MapProfile()
        {
            CreateMap<FormAContract, FormAContractDto>()
                .ForMember(
                    dest => dest.Contract,
                    options =>
                        options.Ignore()); // Member requires complex logic
        }
    }
}