using MediatR;
using ResearchCruiseApp_API.Application.Models.Common.ServiceResult;
using ResearchCruiseApp_API.Application.Models.DTOs.Account;

namespace ResearchCruiseApp_API.Application.UseCases.Account.Login;


public record LoginCommand(LoginFormDto LoginFormDto) : IRequest<Result<LoginResponseDto>>;