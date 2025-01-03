using MediatR;
using ResearchCruiseApp.Application.Models.Common.ServiceResult;

namespace ResearchCruiseApp.Application.UseCases.Users.AcceptUser;

public record AcceptUserCommand(Guid Id) : IRequest<Result>;
