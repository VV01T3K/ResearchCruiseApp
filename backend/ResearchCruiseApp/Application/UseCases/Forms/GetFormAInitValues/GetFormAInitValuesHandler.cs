using MediatR;
using ResearchCruiseApp.Application.Models.Common.ServiceResult;
using ResearchCruiseApp.Application.Models.DTOs.Forms;
using ResearchCruiseApp.Application.Services.Factories.FormAInitValuesDtos;

namespace ResearchCruiseApp.Application.UseCases.Forms.GetFormAInitValues;


public class GetFormAInitValuesHandler(IFormAInitValuesDtosFactory formAInitValuesDtosFactory)
    : IRequestHandler<GetFormAInitValuesQuery, Result<FormAInitValuesDto>>
{
    public async Task<Result<FormAInitValuesDto>> Handle(
        GetFormAInitValuesQuery request, CancellationToken cancellationToken)
    {
        return await formAInitValuesDtosFactory.Create(cancellationToken);
    }
}