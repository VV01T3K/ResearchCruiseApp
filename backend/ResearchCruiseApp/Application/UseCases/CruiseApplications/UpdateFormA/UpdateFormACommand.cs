using MediatR;
using ResearchCruiseApp.Application.Models.Common.Commands.CruiseApplications;
using ResearchCruiseApp.Application.Models.Common.ServiceResult;
using ResearchCruiseApp.Application.Models.DTOs.CruiseApplications;

namespace ResearchCruiseApp.Application.UseCases.CruiseApplications.UpdateFormA;


public record UpdateFormACommand(Guid CruiseApplicationId, FormADto FormADto, bool IsDraft)
    : FormACommand(FormADto, IsDraft), IRequest<Result>;