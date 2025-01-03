using MediatR;
using ResearchCruiseApp.Application.Models.Common.ServiceResult;
using ResearchCruiseApp.Application.Models.DTOs.CruiseApplications;

namespace ResearchCruiseApp.Application.UseCases.CruiseApplications.AddFormB;

public record AddFormBCommand(Guid CruiseApplicationId, FormBDto FormBDto, bool IsDraft)
    : IRequest<Result>;
