using AutoMapper;
using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Application.Common.Models.DTOs;


public class UserDto
{
    public string Id { get; set; } = null!;
    public string UserName { get; set; } = null!;
    public string Email { get; set; } = null!;
    public string FirstName { get; set; } = null!;
    public string LastName { get; set; } = null!;
    public List<string> Roles { get; set; } = null!;
    public bool EmailConfirmed { get; set; }
    public bool Accepted { get; set; }


    private class MapProfile : Profile
    {
        public MapProfile()
        {
            CreateMap<User, UserDto>();
        }
    }
}