using MediatR;
using ResearchCruiseApp_API.Application.Common.Models.ServiceResult;

namespace ResearchCruiseApp_API.Application.UseCases.Users.DeactivateUser;


public record DeactivateUserCommand(Guid Id) : IRequest<Result>;