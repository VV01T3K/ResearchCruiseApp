using MediatR;
using ResearchCruiseApp.Application.Models.Common.ServiceResult;

namespace ResearchCruiseApp.Application.UseCases.Cruises.AutoAddCruises;


public record AutoAddCruisesCommand : IRequest<Result>;