using MediatR;
using ResearchCruiseApp_API.Application.Common.Models.DTOs;
using ResearchCruiseApp_API.Application.Common.Models.ServiceResult;

namespace ResearchCruiseApp_API.Application.UseCases.Account.GetCurrentUser;


public record GetCurrentUserQuery : IRequest<Result<UserDto>>;