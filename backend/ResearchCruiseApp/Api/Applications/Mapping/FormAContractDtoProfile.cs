using AutoMapper;
using ResearchCruiseApp.Api.Applications.Contracts;
using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Api.Applications.Mapping;

internal class FormAContractDtoProfile : Profile
{
    public FormAContractDtoProfile()
    {
        CreateMap<FormAContract, FormAContractDto>()
            .ForMember(dest => dest.Contract, options => options.Ignore()); // Member requires complex logic
    }
}
