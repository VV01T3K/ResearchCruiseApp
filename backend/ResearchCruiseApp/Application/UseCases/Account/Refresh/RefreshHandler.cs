using MediatR;
using ResearchCruiseApp.Application.ExternalServices;
using ResearchCruiseApp.Application.Models.Common.ServiceResult;
using ResearchCruiseApp.Application.Models.DTOs.Account;

namespace ResearchCruiseApp.Application.UseCases.Account.Refresh;


public class RefreshHandler(IIdentityService identityService) : IRequestHandler<RefreshCommand, Result<LoginResponseDto>>
{
    public Task<Result<LoginResponseDto>> Handle(RefreshCommand request, CancellationToken cancellationToken)
    {
        return identityService.RefreshUserTokens(request.RefreshDto);
    }
}