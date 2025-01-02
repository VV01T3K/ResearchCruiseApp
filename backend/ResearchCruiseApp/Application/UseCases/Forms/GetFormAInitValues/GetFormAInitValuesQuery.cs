using MediatR;
using ResearchCruiseApp.Application.Models.Common.ServiceResult;
using ResearchCruiseApp.Application.Models.DTOs.Forms;

namespace ResearchCruiseApp.Application.UseCases.Forms.GetFormAInitValues;


public record GetFormAInitValuesQuery : IRequest<Result<FormAInitValuesDto>>;