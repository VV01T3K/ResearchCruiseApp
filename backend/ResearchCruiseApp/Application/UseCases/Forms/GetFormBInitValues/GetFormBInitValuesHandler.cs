using MediatR;
using ResearchCruiseApp.Application.Models.Common.ServiceResult;
using ResearchCruiseApp.Application.Models.DTOs.Forms;
using ResearchCruiseApp.Application.Services.Factories.FormBInitValuesDtos;

namespace ResearchCruiseApp.Application.UseCases.Forms.GetFormBInitValues;

public class GetFormBInitValuesHandler(IFormBInitValuesDtosFactory formBInitValuesDtosFactory)
    : IRequestHandler<GetFormBInitValuesQuery, Result<FormBInitValuesDto>>
{
    public async Task<Result<FormBInitValuesDto>> Handle(
        GetFormBInitValuesQuery request,
        CancellationToken cancellationToken
    )
    {
        return await formBInitValuesDtosFactory.Create(cancellationToken);
    }
}
