using MediatR;
using ResearchCruiseApp_API.Application.Common.Models.ServiceResult;
using ResearchCruiseApp_API.Application.Models.DTOs.Account;

namespace ResearchCruiseApp_API.Application.UseCases.Account.ChangePassword;


public record ChangePasswordCommand(ChangePasswordFormDto ChangePasswordFormDto) : IRequest<Result>;