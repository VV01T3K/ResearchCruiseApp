using AutoMapper;
using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Application.Models.DTOs.CruiseApplications;


public class ScanDto
{
    public string Name { get; set; } = null!;
    public string Content { get; set; } = null!;
}