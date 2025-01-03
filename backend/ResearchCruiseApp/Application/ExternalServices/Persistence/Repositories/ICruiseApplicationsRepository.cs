using ResearchCruiseApp.Application.Models.DTOs.CruiseApplications;
using ResearchCruiseApp.Domain.Common.Enums;
using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Application.ExternalServices.Persistence.Repositories;

public interface ICruiseApplicationsRepository : IRepository<CruiseApplication>
{
    Task<List<CruiseApplication>> GetAllWithFormsAndFormAContent(
        CancellationToken cancellationToken
    );

    Task<List<CruiseApplication>> GetAllWithFormsAndFormAContentAndEffects(
        CancellationToken cancellationToken
    );

    Task<CruiseApplication?> GetByIdWithFormA(Guid id, CancellationToken cancellationToken);

    Task LoadFormA(CruiseApplication cruiseApplication, CancellationToken cancellationToken);

    Task<CruiseApplication?> GetByIdWithFormAContent(Guid id, CancellationToken cancellationToken);

    Task<CruiseApplication?> GetByIdWithFormAAndFormB(Guid id, CancellationToken cancellationToken);

    Task<CruiseApplication?> GetByIdWithForms(Guid id, CancellationToken cancellationToken);

    Task<CruiseApplication?> GetByIdWithFormsAndFormAContent(
        Guid id,
        CancellationToken cancellationToken
    );

    Task<CruiseApplication?> GetByIdWithFormAAndFormBContent(
        Guid id,
        CancellationToken cancellationToken
    );

    Task<CruiseApplication?> GetByIdWithFormAAndFormCContent(
        Guid id,
        CancellationToken cancellationToken
    );

    Task<List<CruiseApplication>> GetAllByIds(List<Guid> ids, CancellationToken cancellationToken);

    Task<List<CruiseApplication>> GetAllByUserIdWithFormA(
        Guid userId,
        CancellationToken cancellationToken
    );
}
