using MediatR;
using ResearchCruiseApp.Application.Models.Common.ServiceResult;
using ResearchCruiseApp.Application.Models.DTOs.Users;

namespace ResearchCruiseApp.Application.UseCases.Users.GetAllUsers;

public record GetAllUsersQuery : IRequest<Result<List<UserDto>>>;
