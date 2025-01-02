using MediatR;
using ResearchCruiseApp.Application.Models.Common.ServiceResult;
using ResearchCruiseApp.Application.Models.DTOs.Account;

namespace ResearchCruiseApp.Application.UseCases.Account.Refresh;


public record RefreshCommand(RefreshDto RefreshDto) : IRequest<Result<LoginResponseDto>>;