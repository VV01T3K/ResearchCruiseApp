using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using ResearchCruiseApp_API.Application.Common.Models.ServiceResult;
using ResearchCruiseApp_API.Application.ExternalServices.Persistence.Repositories;
using ResearchCruiseApp_API.Application.Models.DTOs.CruiseApplications;
using ResearchCruiseApp_API.Infrastructure.Persistence;

namespace ResearchCruiseApp_API.Application.UseCases.CruiseApplications.GetFormA;


public class GetFormAHandler(
    IMapper mapper,
    ICruiseApplicationsRepository cruiseApplicationsRepository)
    : IRequestHandler<GetFormAQuery, Result<FormADto>>
{
    public async Task<Result<FormADto>> Handle(GetFormAQuery request, CancellationToken cancellationToken)
    {
        var formA = await cruiseApplicationsRepository.GetFormAByCruiseApplicationId(request.ApplicationId,
            cancellationToken); 

        if (formA is null)
            return Error.NotFound();

        var formAModel = mapper.Map<FormADto>(formA);
        return formAModel;
    }
}