using ResearchCruiseApp.Application.Models.DTOs.Forms;
using ResearchCruiseApp.Application.Models.DTOs.Users;

namespace ResearchCruiseApp.Application.Services.Factories.FormUserDtos;


public interface IFormUserDtosFactory
{
    FormUserDto Create(UserDto userDto);
}