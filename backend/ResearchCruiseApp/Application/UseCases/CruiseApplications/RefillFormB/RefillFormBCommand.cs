using MediatR;
using ResearchCruiseApp.Application.Models.Common.ServiceResult;

namespace ResearchCruiseApp.Application.UseCases.CruiseApplications.RefillFormB;

public record RefillFormBCommand(Guid Id) : IRequest<Result>;
