using MediatR;
using ResearchCruiseApp_API.Application.Common.Models.ServiceResult;

namespace ResearchCruiseApp_API.Application.UseCases.Cruises.AutoAddCruises;


public record AutoAddCruisesCommand : IRequest<Result>;