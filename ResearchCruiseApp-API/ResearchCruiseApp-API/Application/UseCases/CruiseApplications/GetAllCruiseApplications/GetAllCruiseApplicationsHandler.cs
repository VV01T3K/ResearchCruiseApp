using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Query;
using ResearchCruiseApp_API.Application.Common.Models.ServiceResponse;
using ResearchCruiseApp_API.Application.UseCases.CruiseApplications.DTOs;
using ResearchCruiseApp_API.Domain.Entities;
using ResearchCruiseApp_API.Infrastructure.Persistence;

namespace ResearchCruiseApp_API.Application.UseCases.CruiseApplications.GetAllCruiseApplications;


public class GetAllCruiseApplicationsHandler(
    ApplicationDbContext applicationDbContext,
    IMapper mapper) 
    : IRequestHandler<GetAllCruiseApplicationsQuery, Result<List<CruiseApplicationDto>>>
{
    public async Task<Result<List<CruiseApplicationDto>>> Handle(
        GetAllCruiseApplicationsQuery request,
        CancellationToken cancellationToken)
    {
        var cruiseApplications = await GetCruiseApplicationsQuery()
            .ToListAsync(cancellationToken);
            
        var cruiseApplicationModels = cruiseApplications
            .Select(mapper.Map<CruiseApplicationDto>)
            .ToList();

        return cruiseApplicationModels;
    }
    
    
    private IIncludableQueryable<CruiseApplication, FormC?> GetCruiseApplicationsQuery()
    {
        return applicationDbContext.CruiseApplications
            .Include(cruiseApplication => cruiseApplication.FormA)
            .Include(cruiseApplication => cruiseApplication.FormA!.CruiseManager)
            .Include(cruiseApplication => cruiseApplication.FormA!.DeputyManager)
            .Include(cruiseApplication => cruiseApplication.FormB)
            .Include(cruiseApplication => cruiseApplication.FormC);
    }
}