using MediatR;
using ResearchCruiseApp.Application.Models.Common.ServiceResult;
using ResearchCruiseApp.Application.Models.DTOs.Account;

namespace ResearchCruiseApp.Application.UseCases.Account.ResendConfirmationEmail;

public record ResendConfirmationEmailCommand(EmailDto EmailDto) : IRequest<Result>;
