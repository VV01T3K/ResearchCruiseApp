using System.Data;
using AutoMapper;
using MediatR;
using ResearchCruiseApp_API.Application.Common.Models.ServiceResult;
using ResearchCruiseApp_API.Application.ExternalServices;
using ResearchCruiseApp_API.Application.ExternalServices.Persistence;
using ResearchCruiseApp_API.Application.ExternalServices.Persistence.Repositories;
using ResearchCruiseApp_API.Application.Models.DTOs.CruiseApplications;
using ResearchCruiseApp_API.Domain.Common.Enums;
using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Application.UseCases.CruiseApplications.AddCruiseApplication;


public class AddCruiseApplicationHandler(
    IYearBasedKeyGenerator yearBasedKeyGenerator,
    IMapper mapper,
    IUnitOfWork unitOfWork,
    IFormsARepository formsARepository,
    ICruiseApplicationsRepository cruiseApplicationsRepository,
    IIdentityService identityService)
    : IRequestHandler<AddCruiseApplicationCommand, Result>
{
    public async Task<Result> Handle(AddCruiseApplicationCommand request, CancellationToken cancellationToken)
    {
        var formAResult = await CreateFormA(request.FormADto);
        if (formAResult.Error is not null)
            return formAResult.Error;
        
        var formA = formAResult.Data!;
        await formsARepository.AddFormA(formA, cancellationToken);
        
        //var evaluatedCruiseApplication = cruiseApplicationEvaluator.EvaluateCruiseApplication(formA, []);
            
        //await researchCruiseContext.EvaluatedCruiseApplications.AddAsync(evaluatedCruiseApplication);
        //await researchCruiseContext.SaveChangesAsync();

        //var calculatedPoints = cruiseApplicationEvaluator.CalculateSumOfPoints(evaluatedCruiseApplication);

        await unitOfWork.ExecuteIsolated(async () =>
            {
                var newCruiseApplication = await CreateCruiseApplication(formA, cancellationToken);

                await cruiseApplicationsRepository.AddCruiseApplication(newCruiseApplication, cancellationToken);
                await unitOfWork.Complete(cancellationToken);
            },
            IsolationLevel.Serializable,
            cancellationToken
        );
        

        return Result.Empty;
    }
    
    
    private async Task<Result<FormA>> CreateFormA(FormADto formADto)
    {
        if (await identityService.GetUserDtoById(formADto.CruiseManagerId) is null)
            return Error.BadRequest("Kierownik nie istnieje");
        if (await identityService.GetUserDtoById(formADto.DeputyManagerId) is null)
            return Error.BadRequest("Zastępca nie istnieje");
        
        return mapper.Map<FormA>(formADto);
    }

    private async Task<CruiseApplication> CreateCruiseApplication(FormA formA, CancellationToken cancellationToken)
    {
        var newCruiseApplication = new CruiseApplication
        {
            Number = await yearBasedKeyGenerator.GenerateKey(cruiseApplicationsRepository, cancellationToken),
            Date = DateOnly.FromDateTime(DateTime.Now),
            FormA = formA,
            FormB = null,
            FormC = null,
            //EvaluatedApplication = evaluatedCruiseApplication,
            Points = 0,
            Status = CruiseApplicationStatus.New
        };

        return newCruiseApplication;
    }
}