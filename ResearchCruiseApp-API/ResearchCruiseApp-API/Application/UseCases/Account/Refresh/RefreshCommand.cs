using MediatR;
using ResearchCruiseApp_API.Application.Common.Models.ServiceResult;
using ResearchCruiseApp_API.Application.Models.DTOs.Account;

namespace ResearchCruiseApp_API.Application.UseCases.Account.Refresh;


public record RefreshCommand(RefreshDto RefreshDto) : IRequest<Result<LoginResponseDto>>;