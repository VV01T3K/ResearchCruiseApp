using MediatR;
using ResearchCruiseApp_API.Application.Common.Models.ServiceResult;
using ResearchCruiseApp_API.Application.Models.DTOs.Users;

namespace ResearchCruiseApp_API.Application.UseCases.Users.AddUser;


public record AddUserCommand(AddUserFormDto AddUserForm) : IRequest<Result>;