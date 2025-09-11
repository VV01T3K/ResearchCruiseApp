using MediatR;
using ResearchCruiseApp.Application.Models.Common.ServiceResult;
using ResearchCruiseApp.Application.Models.DTOs.Cruises;
using ResearchCruiseApp.Application.Services.CruisesService;
using ResearchCruiseApp.Application.Services.Factories.CruiseBlockadePeriodDtos;

namespace ResearchCruiseApp.Application.UseCases.Cruises.GetBlockades;

public class GetBlockadesHandler(
    ICruisesService cruisesService,
    ICruiseBlockadePeriodDtosFactory dtoFactory
) : IRequestHandler<GetBlockadesQuery, Result<List<CruiseBlockadePeriodDto>>>
{
    public async Task<Result<List<CruiseBlockadePeriodDto>>> Handle(
        GetBlockadesQuery request,
        CancellationToken cancellationToken
    )
    {
        var blockingCruises = await cruisesService.GetBlockingCruisesForYear(
            request.Year,
            cancellationToken
        );

        var blockadePeriods = new List<CruiseBlockadePeriodDto>();
        foreach (var cruise in blockingCruises)
        {
            blockadePeriods.Add(await dtoFactory.Create(cruise));
        }

        return blockadePeriods;
    }
}
