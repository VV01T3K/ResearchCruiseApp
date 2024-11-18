using MediatR;
using ResearchCruiseApp_API.Application.Models.Common.ServiceResult;

namespace ResearchCruiseApp_API.Application.UseCases.Users.AcceptUser;


public record AcceptUserCommand(Guid Id) : IRequest<Result>;