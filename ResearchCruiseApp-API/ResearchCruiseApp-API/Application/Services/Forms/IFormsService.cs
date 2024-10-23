using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Application.Services.Forms;


public interface IFormsService
{
    Task DeleteFormB(FormB formB, CancellationToken cancellationToken);

    Task DeleteFormC(FormC formC, CancellationToken cancellationToken);
}