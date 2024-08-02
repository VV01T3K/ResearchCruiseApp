using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using ResearchCruiseApp_API.Application.Common.Models.ServiceResult;
using ResearchCruiseApp_API.Application.Models.DTOs.CruiseApplications;
using ResearchCruiseApp_API.Infrastructure.Persistence;

namespace ResearchCruiseApp_API.Application.UseCases.CruiseApplications.GetCruiseApplicationById;


public class GetCruiseApplicationByIdHandler(ApplicationDbContext applicationDbContext, IMapper mapper)
    : IRequestHandler<GetCruiseApplicationByIdQuery, Result<CruiseApplicationDto>>
{
    public async Task<Result<CruiseApplicationDto>> Handle(
        GetCruiseApplicationByIdQuery request,
        CancellationToken cancellationToken)
    {
        var cruiseApplication = await applicationDbContext.CruiseApplications
            .Include(cruiseApplication => cruiseApplication.FormA)
            .Include(cruiseApplication => cruiseApplication.FormA!.CruiseManager)
            .Include(cruiseApplication => cruiseApplication.FormA!.DeputyManager)
            .FirstOrDefaultAsync(cruiseApplication => cruiseApplication.Id == request.Id, cancellationToken);

        if (cruiseApplication is null)
            return Error.NotFound();

        var cruiseApplicationModel = mapper.Map<CruiseApplicationDto>(cruiseApplication);
        return cruiseApplicationModel;
    }
}