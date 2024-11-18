using MediatR;
using ResearchCruiseApp_API.Application.Models.Common.ServiceResult;

namespace ResearchCruiseApp_API.Application.UseCases.Users.DeactivateUser;


public record DeactivateUserCommand(Guid Id) : IRequest<Result>;