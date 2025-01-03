using ResearchCruiseApp.Domain.Common.Attributes;

namespace ResearchCruiseApp.Domain.Common.Enums;

public enum PublicationCategory
{
    // TODO: Add the same enum to frontend and remove StringValues

    [StringValue("subject")]
    Subject = 0,

    [StringValue("postscript")]
    Postscript = 1,
}
