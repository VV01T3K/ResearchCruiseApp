using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Query;
using ResearchCruiseApp_API.Data;
using ResearchCruiseApp_API.Models;
using ResearchCruiseApp_API.Services.Common;
using ResearchCruiseApp_API.Tools;

namespace ResearchCruiseApp_API.Services;

public class ApplicationsService(
    ResearchCruiseContext researchCruiseContext,
    IMapper mapper)
    : IApplicationsService
{
    public async Task<Result<ApplicationModel>> GetApplicationById(Guid id)
    {
        var application = await researchCruiseContext.Applications
            .Include(application => application.FormA)
            .FirstOrDefaultAsync(application => application.Id == id);

        if (application == null)
            return Error.NotFound();

        var applicationModel = mapper.Map<ApplicationModel>(application);
        return applicationModel;
    }

    public async Task<Result<List<ApplicationModel>>> GetAllApplications()
    {
        var applications = await GetApplicationsQuery()
            .ToListAsync();
            
        var applicationModels = applications
            .Select(mapper.Map<ApplicationModel>)
            .ToList();

        return applicationModels;
    }

    // public async Task<Result<EvaluatedApplicationModel, Error>> CalculatePoints(Guid applicationId)
    // {
    //     var application = await GetApplicationsQuery()
    //         .Include(application => application.EvaluatedApplication)
    //         .Include(application =>
    //             application.EvaluatedApplication != null ? application.EvaluatedApplication.Contracts : null)
    //         .Include(application => application.FormA.Contracts != null ? application.FormA.Contracts : null)
    //         .Include(application =>
    //             application.EvaluatedApplication != null ? application.EvaluatedApplication.Publications : null)
    //         .Include(application => application.FormA.Publications != null ? application.FormA.Publications : null)
    //         .Include(application => application.FormA.GuestTeams != null ? application.FormA.GuestTeams : null)
    //         .Include(application => application.FormA.UGTeams != null ? application.FormA.UGTeams : null)
    //
    //         .Include(application =>
    //             application.EvaluatedApplication != null ? application.EvaluatedApplication.ResearchTasks : null)
    //         .Include(application => application.FormA.ResearchTasks != null ? application.FormA.ResearchTasks : null)
    //         .Include(application =>
    //             application.EvaluatedApplication != null ? application.EvaluatedApplication.SpubTasks : null)
    //         .Include(application => application.FormA.SPUBTasks != null ? application.FormA.SPUBTasks : null)
    //         .FirstOrDefaultAsync(application => application.Id == applicationId);
    //
    //     if (application == null)
    //         return Error.NotFound();
    //
    //     if (application.EvaluatedApplication == null)
    //         return Error.BadRequest();
    //     
    //     var mapper = MapperConfig.InitializeAutomapper();
    //
    //     var evaluatedApplicationModel = mapper.Map<EvaluatedApplicationModel>(application.EvaluatedApplication);
    //     foreach (var ugTeam in application.FormA.UGTeams)
    //     {
    //         evaluatedApplicationModel.UgTeams.Add(mapper.Map<UGTeam>(ugTeam));
    //     }
    //
    //     foreach (var guestTeam in application.FormA.GuestTeams)
    //     {
    //         evaluatedApplicationModel.GuestTeams.Add(mapper.Map<GuestTeam>(guestTeam));
    //     }
    //
    //     return evaluatedApplicationModel;
    // }


    private IIncludableQueryable<Application, FormC?> GetApplicationsQuery()
    {
        return researchCruiseContext.Applications
            .Include(application => application.FormA)
            .Include(application => application.FormB)
            .Include(application => application.FormC);
    }
}