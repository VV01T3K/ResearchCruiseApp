using MediatR;
using ResearchCruiseApp_API.Application.Models.Common.ServiceResult;
using ResearchCruiseApp_API.Application.Models.DTOs.Forms;
using ResearchCruiseApp_API.Application.Services.Factories.FormBInitValuesDtos;

namespace ResearchCruiseApp_API.Application.UseCases.Forms.GetFormBInitValues;


public class GetFormBInitValuesHandler(IFormBInitValuesDtosFactory formBInitValuesDtosFactory)
    : IRequestHandler<GetFormBInitValuesQuery, Result<FormBInitValuesDto>>
{
    public async Task<Result<FormBInitValuesDto>> Handle(
        GetFormBInitValuesQuery request, CancellationToken cancellationToken)
    {
        return await formBInitValuesDtosFactory.Create(cancellationToken);
    }
}