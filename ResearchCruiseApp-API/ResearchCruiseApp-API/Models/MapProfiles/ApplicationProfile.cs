using AutoMapper;
using Microsoft.AspNetCore.Identity;
using ResearchCruiseApp_API.Data;
using static ResearchCruiseApp_API.Data.Application;

namespace ResearchCruiseApp_API.Models.MapProfiles;

public class ApplicationProfile : Profile
{
    public ApplicationProfile()
    {
        CreateMap<Application, ApplicationModel>()
            .ForMember(
                dest => dest.Year,
                options =>
                    options.MapFrom(src =>
                        src.FormA != null ? src.FormA.Year : 0))
            .ForMember(
                dest => dest.CruiseManagerFirstName,
                options =>
                    options.MapFrom<CruiseManagerFirstNameResolver>())
            .ForMember(
                dest => dest.CruiseManagerLastName,
                options =>
                    options.MapFrom<CruiseManagerLastNameResolver>())
            .ForMember(
                dest => dest.DeputyManagerFirstName,
                options =>
                    options.MapFrom<DeputyManagerFirstNameResolver>())
            .ForMember(
                dest => dest.DeputyManagerLastName,
                options =>
                    options.MapFrom<DeputyManagerLastNameResolver>())
            .ForMember(
                dest => dest.Status,
                options =>
                    options.MapFrom(src => 
                        src.Status == ApplicationStatus.New ? "Nowe" :
                            src.Status == ApplicationStatus.Planned ? "Zaplanowane" :
                                src.Status == ApplicationStatus.Denied ? "Odrzucone" :
                                    src.Status == ApplicationStatus.Undertaken ? "Zrealizowane" :
                                        src.Status == ApplicationStatus.Reported ? "Rozliczone" : ""
                    ));

        CreateMap<Application, ApplicationShortInfoModel>();
    }


    private class CruiseManagerFirstNameResolver(
        ResearchCruiseContext researchCruiseContext, UserManager<User> userManager)
        : IValueResolver<Application, ApplicationModel, string>
    {
        public string Resolve(
            Application src, ApplicationModel dest, string cruiseManagerFirstName, ResolutionContext context)
        {
            if (src.FormA == null)
                return "";

            var cruiseManager = userManager.FindByIdAsync(src.FormA.CruiseManagerId.ToString()).Result;
            return cruiseManager == null ? "" : cruiseManager.FirstName;
        }
    }
    
    private class CruiseManagerLastNameResolver(
        ResearchCruiseContext researchCruiseContext, UserManager<User> userManager)
        : IValueResolver<Application, ApplicationModel, string>
    {
        public string Resolve(
            Application src, ApplicationModel dest, string cruiseManagerFirstName, ResolutionContext context)
        {
            if (src.FormA == null)
                return "";

            var cruiseManager = userManager.FindByIdAsync(src.FormA.CruiseManagerId.ToString()).Result;
            return cruiseManager == null ? "" : cruiseManager.LastName;
        }
    }
    
    private class DeputyManagerFirstNameResolver(
        ResearchCruiseContext researchCruiseContext, UserManager<User> userManager)
        : IValueResolver<Application, ApplicationModel, string>
    {
        public string Resolve(
            Application src, ApplicationModel dest, string cruiseManagerFirstName, ResolutionContext context)
        {
            if (src.FormA == null)
                return "";

            var deputyManager = userManager.FindByIdAsync(src.FormA.DeputyManagerId.ToString()).Result;
            return deputyManager == null ? "" : deputyManager.FirstName;
        }
    }
    
    private class DeputyManagerLastNameResolver(
        ResearchCruiseContext researchCruiseContext, UserManager<User> userManager)
        : IValueResolver<Application, ApplicationModel, string>
    {
        public string Resolve(
            Application src, ApplicationModel dest, string cruiseManagerFirstName, ResolutionContext context)
        {
            if (src.FormA == null)
                return "";

            var deputyManager = userManager.FindByIdAsync(src.FormA.DeputyManagerId.ToString()).Result;
            return deputyManager == null ? "" : deputyManager.LastName;
        }
    }
}