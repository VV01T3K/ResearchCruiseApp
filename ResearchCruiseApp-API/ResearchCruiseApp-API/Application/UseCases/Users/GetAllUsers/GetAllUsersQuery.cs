using MediatR;
using ResearchCruiseApp_API.Application.Models.Common.ServiceResult;
using ResearchCruiseApp_API.Application.Models.DTOs.Users;

namespace ResearchCruiseApp_API.Application.UseCases.Users.GetAllUsers;


public record GetAllUsersQuery : IRequest<Result<List<UserDto>>>;