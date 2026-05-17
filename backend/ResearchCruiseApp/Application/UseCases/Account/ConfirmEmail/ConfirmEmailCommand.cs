using MediatR;
using ResearchCruiseApp.Application.Models.Common.ServiceResult;

namespace ResearchCruiseApp.Application.UseCases.Account.ConfirmEmail;

public record ConfirmEmailCommand(Guid UserId, string Code) : IRequest<Result>;
