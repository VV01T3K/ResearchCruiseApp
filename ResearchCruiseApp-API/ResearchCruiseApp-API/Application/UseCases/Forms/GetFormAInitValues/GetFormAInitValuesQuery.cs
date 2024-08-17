using MediatR;
using ResearchCruiseApp_API.Application.Common.Models.ServiceResult;
using ResearchCruiseApp_API.Application.Models.DTOs.Forms;
using ResearchCruiseApp_API.Temp.DTOs;

namespace ResearchCruiseApp_API.Application.UseCases.Forms.GetFormAInitValues;


public record GetFormAInitValuesQuery : IRequest<Result<FormAInitValuesDto>>;