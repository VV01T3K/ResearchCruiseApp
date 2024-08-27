using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Query;
using ResearchCruiseApp_API.Application.ExternalServices;
using ResearchCruiseApp_API.Domain.Entities;
using ResearchCruiseApp_API.Infrastructure.Persistence;
using ResearchCruiseApp_API.Infrastructure.Services.Identity;
using ResearchCruiseApp_API.Temp.Tools;

namespace ResearchCruiseApp_API.Temp.UseCases;


public class CruiseApplicationEvaluation(
    ICruiseApplicationEvaluator cruiseApplicationEvaluator,
    IYearBasedKeyGenerator yearBasedKeyGenerator,
    ICompressor compressor,
    UserManager<User> userManager,
    ApplicationDbContext applicationDbContext,
    IMapper mapper)
{
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
    
    
    private IIncludableQueryable<FormA, List<SpubTask>>GetFormsQuery()
    {
        // TODO include appropriate entities
        return applicationDbContext.FormsA
            .Include(o => o.Contracts)
            .Include(o => o.Publications)
            .Include(o => o.Theses)
            .Include(o => o.GuestTeams)
            .Include(o => o.ResearchTasks)
            .Include(o => o.UgTeams)
            .Include(o => o.SpubTasks);
    }
}