using ResearchCruiseApp_API.Application.Common.Models.DTOs;
using ResearchCruiseApp_API.Application.Models.DTOs.Forms;

namespace ResearchCruiseApp_API.Application.Services.Factories.FormUserDtos;


public interface IFormUserDtosFactory
{
    FormUserDto Create(UserDto userDto);
}