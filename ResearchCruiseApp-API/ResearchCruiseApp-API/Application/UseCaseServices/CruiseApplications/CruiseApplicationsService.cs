using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Query;
using ResearchCruiseApp_API.Application.Common.Models;
using ResearchCruiseApp_API.Application.SharedServices.Compressor;
using ResearchCruiseApp_API.Application.UseCaseServices.CruiseApplications.DTOs;
using ResearchCruiseApp_API.Domain.Common.Enums;
using ResearchCruiseApp_API.Domain.Entities;
using ResearchCruiseApp_API.Infrastructure.Persistence;
using ResearchCruiseApp_API.Infrastructure.Tools;

namespace ResearchCruiseApp_API.Application.UseCaseServices.CruiseApplications;


public class CruiseApplicationsService(
    ICruiseApplicationEvaluator cruiseApplicationEvaluator,
    IYearBasedKeyGenerator yearBasedKeyGenerator,
    ICompressor compressor,
    UserManager<User> userManager,
    ApplicationDbContext applicationDbContext,
    IMapper mapper)
    : ICruiseApplicationsService
{
    public async Task<Result<CruiseApplicationDto>> GetCruiseApplicationById(Guid id)
    {
        var cruiseApplication = await applicationDbContext.CruiseApplications
            .Include(cruiseApplication => cruiseApplication.FormA)
            .FirstOrDefaultAsync(cruiseApplication => cruiseApplication.Id == id);

        if (cruiseApplication is null)
            return Error.NotFound();

        var cruiseApplicationModel = mapper.Map<CruiseApplicationDto>(cruiseApplication);
        return cruiseApplicationModel;
    }

    public async Task<Result<List<CruiseApplicationDto>>> GetAllCruiseApplications()
    {
        var cruiseApplications = await GetCruiseApplicationsQuery()
            .ToListAsync();
            
        var cruiseApplicationModels = cruiseApplications
            .Select(mapper.Map<CruiseApplicationDto>)
            .ToList();

        return cruiseApplicationModels;
    }

    public async Task<Result> AddCruiseApplication(FormADto formADto)
    {
        var formAResult = await CreateFormA(formADto);
        if (formAResult.Error is not null)
            return formAResult.Error;
        
        var formA = formAResult.Data!;
        applicationDbContext.FormsA.Add(formA);
        await applicationDbContext.SaveChangesAsync();
        
        //var evaluatedCruiseApplication = cruiseApplicationEvaluator.EvaluateCruiseApplication(formA, []);
            
        //await researchCruiseContext.EvaluatedCruiseApplications.AddAsync(evaluatedCruiseApplication);
        //await researchCruiseContext.SaveChangesAsync();

        //var calculatedPoints = cruiseApplicationEvaluator.CalculateSumOfPoints(evaluatedCruiseApplication);

        var newCruiseApplication = new CruiseApplication
        {
            Number = yearBasedKeyGenerator.GenerateKey(applicationDbContext.CruiseApplications),
            Date = DateOnly.FromDateTime(DateTime.Now),
            FormA = formA,
            FormB = null,
            FormC = null,
            //EvaluatedApplication = evaluatedCruiseApplication,
            Points = 0,
            Status = CruiseApplicationStatus.New
        };

        await applicationDbContext.CruiseApplications.AddAsync(newCruiseApplication);
        await applicationDbContext.SaveChangesAsync();

        return Result.Empty;
    }

    public async Task<Result<FormADto>> GetFormA(Guid applicationId)
    {
        var formA = await applicationDbContext.CruiseApplications
            .Where(cruiseApplication => cruiseApplication.Id == applicationId)
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
            .SingleOrDefaultAsync();

        if (formA is null)
            return Error.NotFound();

        var formAModel = mapper.Map<FormADto>(formA);
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


    private async Task<Result<FormA>> CreateFormA(FormADto formADto)
    {
        var formA = mapper.Map<FormA>(formADto);
        var cruiseManager = await userManager.FindByIdAsync(formADto.CruiseManagerId.ToString());
        var deputyManager = await userManager.FindByIdAsync(formADto.DeputyManagerId.ToString());

        if (cruiseManager is null || deputyManager is null)
            return Error.BadRequest("Cruise manager and deputy manager have to be defined");

        formA.CruiseManager = cruiseManager;
        formA.DeputyManager = deputyManager;

        return formA;
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