using AutoMapper;
using Microsoft.AspNetCore.Identity;
using ResearchCruiseApp_API.Application.Common.Models.DTOs;

namespace ResearchCruiseApp_API.Domain.Entities;


public class User : IdentityUser
{
    [ProtectedPersonalData]
    public string FirstName { get; set; } = null!;

    [ProtectedPersonalData]
    public string LastName { get; set; } = null!;

    public bool Accepted { get; set; }
    
    
    private class MapProfile : Profile
    {
        public MapProfile()
        {
            CreateMap<User, UserDto>();
        }
    }
}