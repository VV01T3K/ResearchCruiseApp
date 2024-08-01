using AutoMapper;
using Microsoft.EntityFrameworkCore;
using ResearchCruiseApp_API.Application.Common.Models.ServiceResponse;
using ResearchCruiseApp_API.Application.UseCases.CruiseApplications.DTOs;
using ResearchCruiseApp_API.Infrastructure.Persistence;

namespace ResearchCruiseApp_API.Application.UseCases.CruiseApplications.GetCruiseApplicationById;


public class GetCruiseApplicationByIdHandler(ApplicationDbContext applicationDbContext, IMapper mapper)
{
    public async Task<Result<CruiseApplicationDto>> Handle(GetCruiseApplicationByIdQuery request)
    {
        var cruiseApplication = await applicationDbContext.CruiseApplications
            .Include(cruiseApplication => cruiseApplication.FormA)
            .FirstOrDefaultAsync(cruiseApplication => cruiseApplication.Id == request.Id);

        if (cruiseApplication is null)
            return Error.NotFound();

        var cruiseApplicationModel = mapper.Map<CruiseApplicationDto>(cruiseApplication);
        return cruiseApplicationModel;
    }
}