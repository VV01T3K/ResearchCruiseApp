using MediatR;
using ResearchCruiseApp_API.Application.Common.Models.ServiceResponse;
using ResearchCruiseApp_API.Application.UseCases.CruiseApplications.DTOs;

namespace ResearchCruiseApp_API.Application.UseCases.CruiseApplications.AddCruiseApplication;


public record AddCruiseApplicationCommand(FormADto FormADto) : IRequest<Result>;