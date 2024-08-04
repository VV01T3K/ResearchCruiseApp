using AutoMapper;
using MediatR;
using Microsoft.AspNetCore.Identity;
using ResearchCruiseApp_API.Application.Common.Models.ServiceResult;
using ResearchCruiseApp_API.Application.ExternalServices;
using ResearchCruiseApp_API.Application.Models.DTOs.CruiseApplications;
using ResearchCruiseApp_API.Domain.Common.Enums;
using ResearchCruiseApp_API.Domain.Entities;
using ResearchCruiseApp_API.Infrastructure.Persistence;

namespace ResearchCruiseApp_API.Application.UseCases.CruiseApplications.AddCruiseApplication;


public class AddCruiseApplicationHandler(
    ApplicationDbContext applicationDbContext,
    IYearBasedKeyGenerator yearBasedKeyGenerator,
    IMapper mapper,
    UserManager<User> userManager)
    : IRequestHandler<AddCruiseApplicationCommand, Result>
{
    public async Task<Result> Handle(AddCruiseApplicationCommand request, CancellationToken cancellationToken)
    {
        var formAResult = await CreateFormA(request.FormADto);
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
}