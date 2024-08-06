using System.Security.Claims;
using MediatR;
using ResearchCruiseApp_API.Application.Common.Models.DTOs;
using ResearchCruiseApp_API.Application.Common.Models.ServiceResult;
using ResearchCruiseApp_API.Application.Models.DTOs.Users;

namespace ResearchCruiseApp_API.Application.UseCases.Users.GetAllUsers;


public record GetAllUsersQuery : IRequest<Result<List<UserDto>>>;