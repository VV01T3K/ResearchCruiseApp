using MediatR;
using Microsoft.EntityFrameworkCore;
using ResearchCruiseApp_API.Application.Common.Models.ServiceResult;
using ResearchCruiseApp_API.Infrastructure.Persistence;

namespace ResearchCruiseApp_API.Application.UseCases.Cruises.DeleteCruise;


public class DeleteCruiseHandler(
    ApplicationDbContext applicationDbContext)
    : IRequestHandler<DeleteCruiseCommand, Result>
{
    public async Task<Result> Handle(DeleteCruiseCommand request, CancellationToken cancellationToken)
    {
        var cruise = await applicationDbContext.Cruises
            .Include(cruise => cruise.CruiseApplications)
            .Where(cruise => cruise.Id == request.Id)
            .SingleOrDefaultAsync(cancellationToken);

        if (cruise is null)
            return Error.NotFound();

        applicationDbContext.Cruises.Remove(cruise);
        await applicationDbContext.SaveChangesAsync(cancellationToken);

        return Result.Empty;
    }
}