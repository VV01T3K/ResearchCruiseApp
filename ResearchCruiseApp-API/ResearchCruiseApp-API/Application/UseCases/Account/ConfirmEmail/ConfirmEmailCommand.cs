using MediatR;
using ResearchCruiseApp_API.Application.Common.Models.ServiceResult;

namespace ResearchCruiseApp_API.Application.UseCases.Account.ConfirmEmail;


public record ConfirmEmailCommand(Guid UserId, string Code, string? ChangedEmail) : IRequest<Result>;