using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using ResearchCruiseApp_API.Application.Common.Models.ServiceResult;
using ResearchCruiseApp_API.Application.Models.DTOs.CruiseApplications;
using ResearchCruiseApp_API.Infrastructure.Persistence;

namespace ResearchCruiseApp_API.Application.UseCases.CruiseApplications.GetFormA;


public class GetFormAHandler(
    ApplicationDbContext applicationDbContext,
    IMapper mapper)
    : IRequestHandler<GetFormAQuery, Result<FormADto>>
{
    public async Task<Result<FormADto>> Handle(GetFormAQuery request, CancellationToken cancellationToken)
    {
        var formA = await applicationDbContext.CruiseApplications
            .Where(cruiseApplication => cruiseApplication.Id == request.ApplicationId)
            .Include(cruiseApplication => cruiseApplication.FormA)
            .Include(cruiseApplication => cruiseApplication.FormA!.CruiseManager)
            .Include(cruiseApplication => cruiseApplication.FormA!.DeputyManager)
            .Include(cruiseApplication => cruiseApplication.FormA!.Contracts)
            .Include(cruiseApplication => cruiseApplication.FormA!.Publications)
            .Include(cruiseApplication => cruiseApplication.FormA!.Theses)
            .Include(cruiseApplication => cruiseApplication.FormA!.GuestTeams)
            .Include(cruiseApplication => cruiseApplication.FormA!.ResearchTasks)
            .Include(cruiseApplication => cruiseApplication.FormA!.UgTeams)
            .Include(cruiseApplication => cruiseApplication.FormA!.SpubTasks)
            .Select(cruiseApplication => cruiseApplication.FormA)
            .SingleOrDefaultAsync(cancellationToken);

        if (formA is null)
            return Error.NotFound();

        var formAModel = mapper.Map<FormADto>(formA);
        return formAModel;
    }
}