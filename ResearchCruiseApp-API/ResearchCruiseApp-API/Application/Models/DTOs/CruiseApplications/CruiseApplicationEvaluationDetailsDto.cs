using AutoMapper;
using Microsoft.CodeAnalysis;
using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Application.Models.DTOs.CruiseApplications;


public class CruiseApplicationEvaluationDetailsDto
{
    public List<FormAResearchTaskDto> FormAResearchTasks { get; init; } = [];
    
    public List<FormAContractDto> FormAContracts { get; init; }  = [];
    
    public List<UgTeamDto> UgTeams { get; init; } = [];
    
    public string UgUnitsPoints { get; init; } = null!;
    
    public List<FormAPublicationDto> FormAPublications { get; init; } = [];
    
    public List<FormASpubTaskDto> FormASpubTasks { get; init; } = [];
}