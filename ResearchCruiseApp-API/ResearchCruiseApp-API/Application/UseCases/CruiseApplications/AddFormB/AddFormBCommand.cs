using MediatR;
using ResearchCruiseApp_API.Application.Models.Common.ServiceResult;
using ResearchCruiseApp_API.Application.Models.DTOs.CruiseApplications;

namespace ResearchCruiseApp_API.Application.UseCases.CruiseApplications.AddFormB;


public record AddFormBCommand(Guid CruiseApplicationId, FormBDto FormBDto, bool IsDraft) : IRequest<Result>;