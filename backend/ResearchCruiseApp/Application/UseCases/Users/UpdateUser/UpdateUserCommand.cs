using MediatR;
using ResearchCruiseApp.Application.Models.Common.ServiceResult;
using ResearchCruiseApp.Application.Models.DTOs.Users;

namespace ResearchCruiseApp.Application.UseCases.Users.UpdateUser;

public record UpdateUserCommand(Guid UserId, UpdateUserFormDto UpdateUserFormDto) : IRequest<Result>;