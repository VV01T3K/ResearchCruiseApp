using MediatR;
using ResearchCruiseApp_API.Application.Models.Common.ServiceResult;
using ResearchCruiseApp_API.Application.Models.DTOs.Account;

namespace ResearchCruiseApp_API.Application.UseCases.Account.ResetPassword;


public record ResetPasswordCommand(ResetPasswordFormDto ResetPasswordFormDto) : IRequest<Result>;