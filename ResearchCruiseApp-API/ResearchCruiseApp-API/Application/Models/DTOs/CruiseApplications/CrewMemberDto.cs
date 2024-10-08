using System.ComponentModel.DataAnnotations;
using AutoMapper;
using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Application.Models.DTOs.CruiseApplications;


public class CrewMemberDto
{
    [StringLength(1024)]
    public string Title { get; init; } = null!;
    
    [StringLength(1024)]
    public string FirstName { get; init; } = null!;
    
    [StringLength(1024)]
    public string LastName { get; init; } = null!;
    
    [StringLength(1024)]
    public string BirthPlace { get; init; } = null!;
    
    [StringLength(1024)]
    public string BirthDate { get; init; } = null!;
    
    [StringLength(1024)]
    public string DocumentNumber { get; init; } = null!;
    
    [StringLength(1024)]
    public string DocumentExpiryDate { get; init; } = null!;
    
    [StringLength(1024)]
    public string Institution { get; init; } = null!;


    private class MapProfile : Profile
    {
        public MapProfile()
        {
            CreateMap<CrewMemberDto, CrewMember>();

            CreateMap<CrewMember, CrewMemberDto>();
        }
    }
}