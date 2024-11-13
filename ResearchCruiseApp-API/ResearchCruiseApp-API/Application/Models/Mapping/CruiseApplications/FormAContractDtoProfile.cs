using AutoMapper;
using ResearchCruiseApp_API.Application.Models.DTOs.CruiseApplications;
using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Application.Models.Mapping.CruiseApplications;


internal class FormAContractDtoProfile : Profile
{
    public FormAContractDtoProfile()
    {
        CreateMap<FormAContract, FormAContractDto>()
            .ForMember(
                dest => dest.Contract,
                options =>
                    options.Ignore()); // Member requires complex logic
    }
}