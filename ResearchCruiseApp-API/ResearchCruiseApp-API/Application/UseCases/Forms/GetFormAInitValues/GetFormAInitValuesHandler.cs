using MediatR;
using ResearchCruiseApp_API.Application.Common.Models.ServiceResult;
using ResearchCruiseApp_API.Application.Models.DTOs.Forms;
using ResearchCruiseApp_API.Application.Services.Factories.FormAInitValuesDtos;

namespace ResearchCruiseApp_API.Application.UseCases.Forms.GetFormAInitValues;


public class GetFormAInitValuesHandler(IFormAInitValuesDtosFactory formAInitValuesDtosFactory)
    : IRequestHandler<GetFormAInitValuesQuery, Result<FormAInitValuesDto>>
{
    public async Task<Result<FormAInitValuesDto>> Handle(
        GetFormAInitValuesQuery request, CancellationToken cancellationToken)
    {
        return await formAInitValuesDtosFactory.Create(cancellationToken);
    }
}