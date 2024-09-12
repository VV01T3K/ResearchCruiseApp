using AutoMapper;
using ResearchCruiseApp_API.Application.Models.DTOs.CruiseApplications;
using ResearchCruiseApp_API.Domain.Common.Interfaces;
using ResearchCruiseApp_API.Temp.Entities;

namespace ResearchCruiseApp_API.Temp.DTOs;


public class EvaluatedResearchTaskDto : ResearchTaskDto , IEvaluatedField
{
    public Guid Id;
    public ResearchTaskDto ResearchTask { get; set; }
    public int CalculatedPoints { get; set; }

    public EvaluatedResearchTaskDto(ResearchTaskDto taskDto, int calculatedPoints)
    {
        ResearchTask = taskDto;
        CalculatedPoints = calculatedPoints;
    }


    private class MapProfile : Profile
    {
        public MapProfile()
        {
            CreateMap<EvaluatedResearchTaskDto, EvaluatedResearchTask>()
                .ReverseMap();
        }
    }
}

public class EvaluatedContractDto : ContractDto, IEvaluatedField
{
    public Guid Id;
    public int CalculatedPoints { get; set; }
    public ContractDto ContractDto { get; set; }

    public EvaluatedContractDto(ContractDto contractDto, int calculatedPoints)
    {
        this.ContractDto = contractDto;
        this.CalculatedPoints = calculatedPoints;
    }


    private class MapProfile : Profile
    {
        public MapProfile()
        {
            CreateMap<EvaluatedContractDto, EvaluatedContract>()
                .ReverseMap();
        }
    }
}

public class EvaluatedPublicationDto : PublicationDto, IEvaluatedField
{
    public Guid Id;
    public PublicationDto Publication { get; set; }
    public int CalculatedPoints { get; set; }

    public EvaluatedPublicationDto(PublicationDto publicationDto, int calculatedPoints)
    {
        this.Publication = publicationDto;
        this.CalculatedPoints = calculatedPoints;
    }


    private class MapProfile : Profile
    {
        public MapProfile()
        {
            CreateMap<EvaluatedPublicationDto, EvaluatedPublication>()
                .ReverseMap();
        }
    }
}

public class EvaluatedSpubTaskDto : SpubTaskDto, IEvaluatedField
{
    public Guid Id;
    public SpubTaskDto SpubTask { get; set; }
    public int CalculatedPoints { get; set; }

    public EvaluatedSpubTaskDto(SpubTaskDto spubTaskDto, int calculatedPoints)
    {
        this.SpubTask = spubTaskDto;
        this.CalculatedPoints = calculatedPoints;
    }


    private class MapProfile : Profile
    {
        public MapProfile()
        {
            CreateMap<EvaluatedSpubTaskDto, EvaluatedSpubTask>()
                .ReverseMap();
        }
    }
}