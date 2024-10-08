using MediatR;
using ResearchCruiseApp_API.Application.Common.Models.ServiceResult;
using ResearchCruiseApp_API.Application.Models.DTOs.CruiseApplications;

namespace ResearchCruiseApp_API.Application.UseCases.CruiseApplications.AddFormB;


public record AddFormBCommand(Guid CruiseApplicationId, FormBDto FormBDto) : IRequest<Result>;