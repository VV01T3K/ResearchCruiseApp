using MediatR;
using ResearchCruiseApp.Application.Models.Common.ServiceResult;
using ResearchCruiseApp.Application.Models.DTOs.CruiseApplications;

namespace ResearchCruiseApp.Application.UseCases.CruiseApplications.AddFormC;


public record AddFormCCommand(Guid CruiseApplicationId, FormCDto FormCDto) : IRequest<Result>;