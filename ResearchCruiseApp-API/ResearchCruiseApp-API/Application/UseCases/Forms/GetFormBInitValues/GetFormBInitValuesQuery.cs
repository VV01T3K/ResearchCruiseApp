using MediatR;
using ResearchCruiseApp_API.Application.Common.Models.ServiceResult;
using ResearchCruiseApp_API.Application.Models.DTOs.Forms;

namespace ResearchCruiseApp_API.Application.UseCases.Forms.GetFormBInitValues;


public record GetFormBInitValuesQuery : IRequest<Result<FormBInitValuesDto>>;