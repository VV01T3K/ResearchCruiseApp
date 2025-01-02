using MediatR;
using ResearchCruiseApp.Application.Models.Common.ServiceResult;

namespace ResearchCruiseApp.Application.UseCases.Users.DeactivateUser;


public record DeactivateUserCommand(Guid Id) : IRequest<Result>;