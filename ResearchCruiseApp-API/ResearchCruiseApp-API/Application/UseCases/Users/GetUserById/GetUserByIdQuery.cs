using MediatR;
using ResearchCruiseApp_API.Application.Models.Common.ServiceResult;
using ResearchCruiseApp_API.Application.Models.DTOs.Users;

namespace ResearchCruiseApp_API.Application.UseCases.Users.GetUserById;


public record GetUserByIdQuery(Guid Id) : IRequest<Result<UserDto>>;