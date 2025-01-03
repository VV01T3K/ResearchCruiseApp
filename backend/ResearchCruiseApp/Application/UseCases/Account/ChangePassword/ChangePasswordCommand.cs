using MediatR;
using ResearchCruiseApp.Application.Models.Common.ServiceResult;
using ResearchCruiseApp.Application.Models.DTOs.Account;

namespace ResearchCruiseApp.Application.UseCases.Account.ChangePassword;

public record ChangePasswordCommand(ChangePasswordFormDto ChangePasswordFormDto) : IRequest<Result>;
