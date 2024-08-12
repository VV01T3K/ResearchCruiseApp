using System.ComponentModel.DataAnnotations;
using AutoMapper;
using Microsoft.AspNetCore.Identity;
using ResearchCruiseApp_API.Application.Common.Models.DTOs;

namespace ResearchCruiseApp_API.Infrastructure.Services.Identity;


public class User : IdentityUser
{
    [ProtectedPersonalData]
    [StringLength(1024)]
    public string FirstName { get; set; } = null!;
    
    [ProtectedPersonalData]
    [StringLength(1024)]
    public string LastName { get; set; } = null!;
    
    public bool Accepted { get; set; }
    
    [StringLength(1024)]
    public string? RefreshToken { get; set; }
    
    public DateTime? RefreshTokenExpiry { get; set; }
    
    
    private class MapProfile : Profile
    {
        public MapProfile()
        {
            CreateMap<User, UserDto>();
        }
    }
}