using MediatR;
using ResearchCruiseApp_API.Application.Models.Common.ServiceResult;
using ResearchCruiseApp_API.Application.Models.DTOs.Users;

namespace ResearchCruiseApp_API.Application.UseCases.Account.GetCurrentUser;


public record GetCurrentUserQuery : IRequest<Result<UserDto>>;