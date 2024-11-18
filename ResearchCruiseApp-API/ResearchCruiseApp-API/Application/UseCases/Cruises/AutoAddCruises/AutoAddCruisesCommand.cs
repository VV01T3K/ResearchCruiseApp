using MediatR;
using ResearchCruiseApp_API.Application.Models.Common.ServiceResult;

namespace ResearchCruiseApp_API.Application.UseCases.Cruises.AutoAddCruises;


public record AutoAddCruisesCommand : IRequest<Result>;