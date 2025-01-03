using ResearchCruiseApp.Application.Models.DTOs.Forms;
using ResearchCruiseApp.Application.Models.DTOs.Users;

namespace ResearchCruiseApp.Application.Services.Factories.FormUserDtos;

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
