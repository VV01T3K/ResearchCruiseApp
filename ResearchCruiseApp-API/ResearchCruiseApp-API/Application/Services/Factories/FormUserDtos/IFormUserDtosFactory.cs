using ResearchCruiseApp_API.Application.Models.DTOs.Forms;
using ResearchCruiseApp_API.Application.Models.DTOs.Users;

namespace ResearchCruiseApp_API.Application.Services.Factories.FormUserDtos;


public interface IFormUserDtosFactory
{
    FormUserDto Create(UserDto userDto);
}