using MediatR;
using ResearchCruiseApp.Application.Models.Common.ServiceResult;

namespace ResearchCruiseApp.Application.UseCases.CruiseApplications.AcceptCruiseApplication;


public record AcceptCruiseApplicationCommand(Guid CruiseApplicationId, bool Accept)
    : IRequest<Result>;