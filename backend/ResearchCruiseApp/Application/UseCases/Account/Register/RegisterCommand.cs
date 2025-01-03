using MediatR;
using ResearchCruiseApp.Application.Models.Common.ServiceResult;
using ResearchCruiseApp.Application.Models.DTOs.Account;

namespace ResearchCruiseApp.Application.UseCases.Account.Register;

public record RegisterCommand(RegisterFormDto RegisterFormDto) : IRequest<Result>;
