using MediatR;
using ResearchCruiseApp.Application.Models.Common.ServiceResult;
using ResearchCruiseApp.Application.Models.DTOs.Account;

namespace ResearchCruiseApp.Application.UseCases.Account.Login;

public record LoginCommand(LoginFormDto LoginFormDto) : IRequest<Result<LoginResponseDto>>;
