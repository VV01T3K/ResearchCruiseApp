using AutoMapper;
using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Application.Models.DTOs.CruiseApplications;


public class ThesisDto
{
    public string Category { get; set; } = null!;
    public string Author { get; set; } = null!;
    public string Title { get; set; } = null!;
    public string Promoter { get; set; } = null!;
    public int Year { get; set; }
}