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


public class CruiseApplicationsService(
    ICruiseApplicationEvaluator cruiseApplicationEvaluator,
    IYearBasedKeyGenerator yearBasedKeyGenerator,
    ResearchCruiseContext researchCruiseContext,
    IMapper mapper)
    : ICruiseApplicationsService
{
    public async Task<Result<CruiseApplicationModel>> GetCruiseApplicationById(Guid id)
    {
        var cruiseApplication = await researchCruiseContext.CruiseApplications
            .Include(cruiseApplication => cruiseApplication.FormA)
            .FirstOrDefaultAsync(cruiseApplication => cruiseApplication.Id == id);

        if (cruiseApplication is null)
            return Error.NotFound();

        var cruiseApplicationModel = mapper.Map<CruiseApplicationModel>(cruiseApplication);
        return cruiseApplicationModel;
    }

    public async Task<Result<List<CruiseApplicationModel>>> GetAllCruiseApplications()
    {
        var cruiseApplications = await GetCruiseApplicationsQuery()
            .ToListAsync();
            
        var cruiseApplicationModels = cruiseApplications
            .Select(mapper.Map<CruiseApplicationModel>)
            .ToList();

        return cruiseApplicationModels;
    }

    public async Task<Result> AddCruiseApplication(FormAModel formAModel)
    {
        var formA = mapper.Map<FormA>(formAModel);
            
        researchCruiseContext.FormsA.Add(formA);
        await researchCruiseContext.SaveChangesAsync();
        
        var evaluatedCruiseApplication = cruiseApplicationEvaluator.EvaluateCruiseApplication(formA, []);
            
        await researchCruiseContext.EvaluatedCruiseApplications.AddAsync(evaluatedCruiseApplication);
        await researchCruiseContext.SaveChangesAsync();

        var calculatedPoints = cruiseApplicationEvaluator.CalculateSumOfPoints(evaluatedCruiseApplication);

        var newCruiseApplication = new CruiseApplication
        {
            Number = yearBasedKeyGenerator.GenerateKey(researchCruiseContext.CruiseApplications),
            Date = DateOnly.FromDateTime(DateTime.Now),
            FormA = formA,
            FormB = null,
            FormC = null,
            EvaluatedApplication = evaluatedCruiseApplication,
            Points = calculatedPoints,
            Status = CruiseApplicationStatus.New
        };

        await researchCruiseContext.CruiseApplications.AddAsync(newCruiseApplication);
        await researchCruiseContext.SaveChangesAsync();

        return Result.Empty;
    }

    public async Task<Result<FormAModel>> GetFormA(Guid applicationId)
    {
        var formA = await researchCruiseContext.CruiseApplications
            .Where(cruiseApplication => cruiseApplication.Id == applicationId)
            .Include(cruiseApplication => cruiseApplication.FormA)
            .Include(cruiseApplication => cruiseApplication.FormA!.Contracts)
            .Include(cruiseApplication => cruiseApplication.FormA!.Publications)
            .Include(cruiseApplication => cruiseApplication.FormA!.Theses)
            .Include(cruiseApplication => cruiseApplication.FormA!.GuestTeams)
            .Include(cruiseApplication => cruiseApplication.FormA!.ResearchTasks)
            .Include(cruiseApplication => cruiseApplication.FormA!.UgTeams)
            .Include(cruiseApplication => cruiseApplication.FormA!.SpubTasks)
            .Select(cruiseApplication => cruiseApplication.FormA)
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
    
    private IIncludableQueryable<CruiseApplication, FormC?> GetCruiseApplicationsQuery()
    {
        return researchCruiseContext.CruiseApplications
            .Include(cruiseApplication => cruiseApplication.FormA)
            .Include(cruiseApplication => cruiseApplication.FormB)
            .Include(cruiseApplication => cruiseApplication.FormC);
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