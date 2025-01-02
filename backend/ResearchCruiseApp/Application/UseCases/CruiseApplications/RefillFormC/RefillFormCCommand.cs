using MediatR;
using ResearchCruiseApp.Application.Models.Common.ServiceResult;

namespace ResearchCruiseApp.Application.UseCases.CruiseApplications.RefillFormC;


public record RefillFormCCommand(Guid Id) : IRequest<Result>;