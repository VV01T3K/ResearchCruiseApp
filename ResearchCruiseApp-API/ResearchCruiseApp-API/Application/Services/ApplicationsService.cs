using AutoMapper;
using Microsoft.CodeAnalysis;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Query;
using ResearchCruiseApp_API.Application.Common;
using ResearchCruiseApp_API.Application.DTOs;
using ResearchCruiseApp_API.Domain.Common.Enums;
using ResearchCruiseApp_API.Domain.Entities;
using ResearchCruiseApp_API.Infrastructure.Persistence.DbContexts;
using ResearchCruiseApp_API.Infrastructure.Tools;

namespace ResearchCruiseApp_API.Application.Services;


public class ApplicationsService(
    IApplicationEvaluator applicationEvaluator,
    IYearBasedKeyGenerator yearBasedKeyGenerator,
    ResearchCruiseContext researchCruiseContext,
    IMapper mapper)
    : IApplicationsService
{
    public async Task<Result<ApplicationModel>> GetApplicationById(Guid id)
    {
        var application = await researchCruiseContext.Applications
            .Include(application => application.FormA)
            .FirstOrDefaultAsync(application => application.Id == id);

        if (application is null)
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

    public async Task<Result> AddApplication(FormAModel formAModel)
    {
        var formA = mapper.Map<FormA>(formAModel);
            
        researchCruiseContext.FormsA.Add(formA);
        await researchCruiseContext.SaveChangesAsync();
        
        var evaluatedApplication = applicationEvaluator.EvaluateApplication(formA, []);
            
        await researchCruiseContext.EvaluatedApplications.AddAsync(evaluatedApplication);
        await researchCruiseContext.SaveChangesAsync();

        var calculatedPoints = applicationEvaluator.CalculateSumOfPoints(evaluatedApplication);

        var newApplication = new Domain.Entities.CruiseApplication
        {
            Number = yearBasedKeyGenerator.GenerateKey(researchCruiseContext.Applications),
            Date = DateOnly.FromDateTime(DateTime.Now),
            FormA = formA,
            FormB = null,
            FormC = null,
            EvaluatedApplication = evaluatedApplication,
            Points = calculatedPoints,
            Status = ApplicationStatus.New
        };

        await researchCruiseContext.Applications.AddAsync(newApplication);
        await researchCruiseContext.SaveChangesAsync();

        return Result.Empty;
    }

    public async Task<Result<FormAModel>> GetFormA(Guid applicationId)
    {
        var formA = await researchCruiseContext.Applications
            .Where(application => application.Id == applicationId)
            .Include(application => application.FormA)
            .Include(application => application.FormA!.Contracts)
            .Include(application => application.FormA!.Publications)
            .Include(application => application.FormA!.Theses)
            .Include(application => application.FormA!.GuestTeams)
            .Include(application => application.FormA!.ResearchTasks)
            .Include(application => application.FormA!.UgTeams)
            .Include(application => application.FormA!.SpubTasks)
            .Select(application => application.FormA)
            .SingleOrDefaultAsync();

        if (formA is null)
            return Error.NotFound();

        var formAModel = mapper.Map<FormAModel>(formA);
        return formAModel;
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
    
    private IIncludableQueryable<Domain.Entities.CruiseApplication, FormC?> GetApplicationsQuery()
    {
        return researchCruiseContext.Applications
            .Include(application => application.FormA)
            .Include(application => application.FormB)
            .Include(application => application.FormC);
    }
    
    private IIncludableQueryable<FormA, List<SpubTask>>GetFormsQuery()
    {
        // TODO include appropriate entities
        return researchCruiseContext.FormsA
            .Include(o => o.Contracts)
            .Include(o => o.Publications)
            .Include(o => o.Theses)
            .Include(o => o.GuestTeams)
            .Include(o => o.ResearchTasks)
            .Include(o => o.UgTeams)
            .Include(o => o.SpubTasks);
    }
}