using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using ResearchCruiseApp_API.Data;
using ResearchCruiseApp_API.Models.DataTypes;

namespace ResearchCruiseApp_API.Models.MapProfiles;

public class CruiseProfile : Profile
{
    public CruiseProfile()
    {
        CreateMap<Cruise, CruiseModel>()
            .ForMember(dest => dest.MainCruiseManagerId,
                options =>
                    options.MapFrom(src =>
                        src.MainCruiseManagerId))
            .ForMember(
                dest => dest.MainCruiseManagerFirstName,
                options =>
                    options.MapFrom<MainCruiseManagerFirstNameResolver>())
            .ForMember(
                dest => dest.MainCruiseManagerLastName,
                options =>
                    options.MapFrom<MainCruiseManagerLastNameResolver>())
            .ForMember(dest => dest.MainDeputyManagerId,
                options =>
                    options.MapFrom(src =>
                        src.MainDeputyManagerId))
            .ForMember(
                dest => dest.Date,
                options =>
                    options.MapFrom(src =>
                        new StringRange
                        {
                            Start = src.StartDate.ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ss.fffK"),
                            End = src.EndDate.ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ss.fffK")
                        }))
            .ForMember(
                dest => dest.ApplicationsShortInfo,
                options =>
                    options.MapFrom<ApplicationsShortInfoResolver>());

        CreateMap<CruiseFormModel, Cruise>()
            .ForMember(dest => dest.MainCruiseManagerId,
                options =>
                    options.MapFrom(src =>
                        src.ManagersTeam.MainCruiseManagerId))
            .ForMember(dest => dest.MainDeputyManagerId,
                options =>
                    options.MapFrom(src =>
                        src.ManagersTeam.MainDeputyManagerId))
            .ForMember(dest => dest.Number,
                options =>
                    options.MapFrom(src =>
                        ""))
            .ForMember(dest => dest.StartDate,
                options =>
                    options.MapFrom(src =>
                        src.Date.Start))
            .ForMember(dest => dest.EndDate,
                options =>
                    options.MapFrom(src =>
                        src.Date.End))
            .ForMember(dest => dest.Applications,
                options =>
                    options.MapFrom<CruiseApplicationsResolver>());
    }


    private class MainCruiseManagerFirstNameResolver(
        ResearchCruiseContext researchCruiseContext,
        UserManager<User> userManager)
        : IValueResolver<Cruise, CruiseModel, string>
    {
        public string Resolve(
            Cruise src, CruiseModel dest, string mainCruiseManagerFirstName, ResolutionContext context)
        {
            var mainCruiseManager = userManager.FindByIdAsync(src.MainCruiseManagerId.ToString()).Result;
            return mainCruiseManager == null ? "" : mainCruiseManager.FirstName;
        }
    }
    
    private class MainCruiseManagerLastNameResolver(
        ResearchCruiseContext researchCruiseContext,
        UserManager<User> userManager)
        : IValueResolver<Cruise, CruiseModel, string>
    {
        public string Resolve(
            Cruise src, CruiseModel dest, string mainCruiseManagerFirstName, ResolutionContext context)
        {
            var mainCruiseManager = userManager.FindByIdAsync(src.MainCruiseManagerId.ToString()).Result;
            return mainCruiseManager == null ? "" : mainCruiseManager.LastName;
        }
    }
    
    private class DateResolver(
        ResearchCruiseContext researchCruiseContext,
        UserManager<User> userManager)
        : IValueResolver<Cruise, CruiseModel, StringRange>
    {
        public StringRange Resolve(
            Cruise src, CruiseModel dest, StringRange date, ResolutionContext context)
        {
            return new StringRange
            {
                Start = src.StartDate.ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ss.fffK"),
                End = src.EndDate.ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ss.fffK")
            };
        }
    }
    
    private class ApplicationsShortInfoResolver(
        ResearchCruiseContext researchCruiseContext,
        UserManager<User> userManager,
        IMapper mapper)
        : IValueResolver<Cruise, CruiseModel, List<ApplicationShortInfoModel>>
    {
        public List<ApplicationShortInfoModel> Resolve(
            Cruise src,
            CruiseModel dest,
            List<ApplicationShortInfoModel> applicationsShortInfo,
            ResolutionContext context)
        {
            var result = src.Applications
                .Select(mapper.Map<ApplicationShortInfoModel>)
                .ToList();
            return result;
        }
    }
    
    private class CruiseApplicationsResolver(
        ResearchCruiseContext researchCruiseContext,
        UserManager<User> userManager,
        IMapper mapper)
        : IValueResolver<CruiseFormModel, Cruise, List<Application>>
    {
        public List<Application> Resolve(
            CruiseFormModel src,
            Cruise dest,
            List<Application> applications,
            ResolutionContext context)
        {
            var result = researchCruiseContext.Applications
                //.AsEnumerable()
                .Where(application => src.ApplicationsIds.Contains(application.Id))
                .ToList();
            return result;
        }
    }
}