using MediatR;
using ResearchCruiseApp.Application.Models.Common.ServiceResult;
using ResearchCruiseApp.Application.Models.DTOs.Account;

namespace ResearchCruiseApp.Application.UseCases.Account.ResetPassword;

public record ResetPasswordCommand(ResetPasswordFormDto ResetPasswordFormDto) : IRequest<Result>;
