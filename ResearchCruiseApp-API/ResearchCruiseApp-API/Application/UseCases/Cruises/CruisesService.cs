using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using ResearchCruiseApp_API.Application.ExternalServices;
using ResearchCruiseApp_API.Domain.Entities;
using ResearchCruiseApp_API.Infrastructure.Persistence;

namespace ResearchCruiseApp_API.Application.UseCases.Cruises;


public class CruisesService(
    IYearBasedKeyGenerator yearBasedKeyGenerator,
    UserManager<User> userManager,
    ApplicationDbContext applicationDbContext,
    IMapper mapper)
{
}