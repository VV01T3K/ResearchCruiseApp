using AutoMapper;
using Microsoft.AspNetCore.Identity;
using ResearchCruiseApp_API.Data;

namespace ResearchCruiseApp_API.Models.MapProfiles;

public class ApplicationProfile : Profile
{
    public ApplicationProfile()
    {
        CreateMap<Application, ApplicationModel>()
            .ForMember(
                dest => dest.Id,
                options =>
                    options.MapFrom(src => src.Id))
            .ForMember(
                dest => dest.Number,
                options =>
                    options.MapFrom(src => src.Number))
            .ForMember(
                dest => dest.Date,
                options =>
                    options.MapFrom(src => src.Date))
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
                    options.MapFrom<CruiseManagerLastNameResolver>());
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
}