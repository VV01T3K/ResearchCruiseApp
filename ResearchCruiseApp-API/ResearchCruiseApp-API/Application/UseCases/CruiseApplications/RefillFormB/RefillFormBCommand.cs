using MediatR;
using ResearchCruiseApp_API.Application.Models.Common.ServiceResult;

namespace ResearchCruiseApp_API.Application.UseCases.CruiseApplications.RefillFormB;


public record RefillFormBCommand(Guid Id) : IRequest<Result>;