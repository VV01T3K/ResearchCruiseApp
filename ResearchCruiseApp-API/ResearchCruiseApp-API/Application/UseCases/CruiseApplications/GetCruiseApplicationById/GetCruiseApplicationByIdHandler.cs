using AutoMapper;
using MediatR;
using ResearchCruiseApp_API.Application.Common.Models.ServiceResult;
using ResearchCruiseApp_API.Application.ExternalServices.Persistence.Repositories;
using ResearchCruiseApp_API.Application.Models.DTOs.CruiseApplications;
using ResearchCruiseApp_API.Application.SharedServices.Factories.CruiseApplicationDtos;

namespace ResearchCruiseApp_API.Application.UseCases.CruiseApplications.GetCruiseApplicationById;


public class GetCruiseApplicationByIdHandler(
    ICruiseApplicationDtosFactory cruiseApplicationDtosFactory,
    ICruiseApplicationsRepository cruiseApplicationsRepository,
    IMapper mapper)
    : IRequestHandler<GetCruiseApplicationByIdQuery, Result<CruiseApplicationDto>>
{
    public async Task<Result<CruiseApplicationDto>> Handle(
        GetCruiseApplicationByIdQuery request,
        CancellationToken cancellationToken)
    {
        var cruiseApplication =
            await cruiseApplicationsRepository.GetById(request.Id, cancellationToken);

        if (cruiseApplication is null)
            return Error.NotFound();

        var cruiseApplicationDto = await cruiseApplicationDtosFactory.Create(cruiseApplication);
        return cruiseApplicationDto;
    }
}