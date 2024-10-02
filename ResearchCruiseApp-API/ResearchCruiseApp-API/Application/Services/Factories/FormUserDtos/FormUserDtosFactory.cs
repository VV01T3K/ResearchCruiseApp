using ResearchCruiseApp_API.Application.Common.Models.DTOs;
using ResearchCruiseApp_API.Application.Models.DTOs.Forms;

namespace ResearchCruiseApp_API.Application.Services.Factories.FormUserDtos;


public class FormUserDtosFactory : IFormUserDtosFactory
{
    public FormUserDto Create(UserDto userDto)
    { 
        var formUserDto = new FormUserDto
        {
            Id = userDto.Id,
            Email = userDto.Email,
            FirstName = userDto.FirstName,
            LastName = userDto.LastName,
        };

        return formUserDto;
    }
}