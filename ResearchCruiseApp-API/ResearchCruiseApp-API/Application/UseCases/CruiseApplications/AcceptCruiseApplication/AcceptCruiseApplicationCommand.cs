using MediatR;
using ResearchCruiseApp_API.Application.Common.Models.ServiceResult;

namespace ResearchCruiseApp_API.Application.UseCases.CruiseApplications.AcceptCruiseApplication;


public record AcceptCruiseApplicationCommand(Guid CruiseApplicationId, bool Accept)
    : IRequest<Result>;