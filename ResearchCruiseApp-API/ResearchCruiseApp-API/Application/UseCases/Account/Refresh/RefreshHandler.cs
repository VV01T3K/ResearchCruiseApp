using MediatR;
using ResearchCruiseApp_API.Application.ExternalServices;
using ResearchCruiseApp_API.Application.Models.Common.ServiceResult;
using ResearchCruiseApp_API.Application.Models.DTOs.Account;

namespace ResearchCruiseApp_API.Application.UseCases.Account.Refresh;


public class RefreshHandler(IIdentityService identityService) : IRequestHandler<RefreshCommand, Result<LoginResponseDto>>
{
    public Task<Result<LoginResponseDto>> Handle(RefreshCommand request, CancellationToken cancellationToken)
    {
        return identityService.RefreshUserTokens(request.RefreshDto);
    }
}