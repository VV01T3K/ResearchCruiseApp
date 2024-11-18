using MediatR;
using ResearchCruiseApp_API.Application.Models.Common.ServiceResult;

namespace ResearchCruiseApp_API.Application.UseCases.CruiseApplications.AcceptCruiseApplication;


public record AcceptCruiseApplicationCommand(Guid CruiseApplicationId, bool Accept)
    : IRequest<Result>;