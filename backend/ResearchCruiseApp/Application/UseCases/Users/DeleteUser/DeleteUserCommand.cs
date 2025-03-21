using MediatR;
using ResearchCruiseApp.Application.Models.Common.ServiceResult;

namespace ResearchCruiseApp.Application.UseCases.Users.DeleteUser;

public record DeleteUserCommand(Guid Id) : IRequest<Result>;
