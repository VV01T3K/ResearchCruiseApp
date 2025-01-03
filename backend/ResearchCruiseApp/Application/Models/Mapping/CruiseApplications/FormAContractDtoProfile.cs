using AutoMapper;
using ResearchCruiseApp.Application.Models.DTOs.CruiseApplications;
using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Application.Models.Mapping.CruiseApplications;

internal class FormAContractDtoProfile : Profile
{
    public FormAContractDtoProfile()
    {
        CreateMap<FormAContract, FormAContractDto>()
            .ForMember(dest => dest.Contract, options => options.Ignore()); // Member requires complex logic
    }
}
