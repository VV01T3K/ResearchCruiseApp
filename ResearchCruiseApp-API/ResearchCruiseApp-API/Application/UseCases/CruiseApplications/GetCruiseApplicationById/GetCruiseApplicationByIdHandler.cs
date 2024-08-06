using AutoMapper;
using MediatR;
using ResearchCruiseApp_API.Application.Common.Models.ServiceResult;
using ResearchCruiseApp_API.Application.ExternalServices.Persistence.Repositories;
using ResearchCruiseApp_API.Application.Models.DTOs.CruiseApplications;

namespace ResearchCruiseApp_API.Application.UseCases.CruiseApplications.GetCruiseApplicationById;


public class GetCruiseApplicationByIdHandler(
    ICruiseApplicationsRepository cruiseApplicationsRepository,
    IMapper mapper)
    : IRequestHandler<GetCruiseApplicationByIdQuery, Result<CruiseApplicationDto>>
{
    public async Task<Result<CruiseApplicationDto>> Handle(
        GetCruiseApplicationByIdQuery request,
        CancellationToken cancellationToken)
    {
        var cruiseApplication =
            await cruiseApplicationsRepository.GetCruiseApplicationById(request.Id, cancellationToken);

        if (cruiseApplication is null)
            return Error.NotFound();

        var cruiseApplicationModel = mapper.Map<CruiseApplicationDto>(cruiseApplication);
        return cruiseApplicationModel;
    }
}