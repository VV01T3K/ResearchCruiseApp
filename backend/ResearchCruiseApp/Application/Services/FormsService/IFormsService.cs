using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Application.Services.FormsService;

public interface IFormsService
{
    Task DeleteFormA(FormA formA, CancellationToken cancellationToken);

    Task DeleteFormB(FormB formB, CancellationToken cancellationToken);

    Task DeleteFormC(FormC formC, CancellationToken cancellationToken);
}
