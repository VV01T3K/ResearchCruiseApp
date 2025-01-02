using MediatR;
using ResearchCruiseApp.Application.Models.Common.ServiceResult;
using ResearchCruiseApp.Application.Models.DTOs.Forms;

namespace ResearchCruiseApp.Application.UseCases.Forms.GetFormBInitValues;


public record GetFormBInitValuesQuery : IRequest<Result<FormBInitValuesDto>>;