using AutoMapper;
using MediatR;
using ResearchCruiseApp_API.Application.Common.Models.ServiceResult;
using ResearchCruiseApp_API.Application.ExternalServices;
using ResearchCruiseApp_API.Application.ExternalServices.Persistence.Repositories;
using ResearchCruiseApp_API.Application.Models.DTOs.CruiseApplications;
using ResearchCruiseApp_API.Application.SharedServices.Factories.ContractDtos;
using ResearchCruiseApp_API.Application.SharedServices.Factories.FormADtos;
using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Application.UseCases.CruiseApplications.GetFormA;


public class GetFormAHandler(
    ICompressor compressor,
    IMapper mapper,
    ICruiseApplicationsRepository cruiseApplicationsRepository,
    IFormADtosFactory formADtosFactory)
    : IRequestHandler<GetFormAQuery, Result<FormADto>>
{
    public async Task<Result<FormADto>> Handle(GetFormAQuery request, CancellationToken cancellationToken)
    {
        var formA = await cruiseApplicationsRepository
            .GetFormAByCruiseApplicationId(request.ApplicationId, cancellationToken); 

        if (formA is null)
            return Error.NotFound();
        
        return await formADtosFactory.Create(formA);
    }
}