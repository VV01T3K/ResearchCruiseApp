using MediatR;
using ResearchCruiseApp_API.Application.Models.Common.Commands.CruiseApplications;
using ResearchCruiseApp_API.Application.Models.Common.ServiceResult;
using ResearchCruiseApp_API.Application.Models.DTOs.CruiseApplications;

namespace ResearchCruiseApp_API.Application.UseCases.CruiseApplications.UpdateFormA;


public record UpdateFormACommand(Guid CruiseApplicationId, FormADto FormADto, bool IsDraft)
    : FormACommand(FormADto, IsDraft), IRequest<Result>;