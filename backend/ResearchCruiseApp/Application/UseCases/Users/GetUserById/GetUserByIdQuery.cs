using MediatR;
using ResearchCruiseApp.Application.Models.Common.ServiceResult;
using ResearchCruiseApp.Application.Models.DTOs.Users;

namespace ResearchCruiseApp.Application.UseCases.Users.GetUserById;


public record GetUserByIdQuery(Guid Id) : IRequest<Result<UserDto>>;