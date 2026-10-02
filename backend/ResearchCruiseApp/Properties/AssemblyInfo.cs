using System.Resources;
using System.Runtime.CompilerServices;

[assembly: InternalsVisibleTo("ResearchCruiseApp.Tests")]

[assembly: InternalsVisibleTo("ResearchCruiseApp.UnitTests")]
[assembly: InternalsVisibleTo("ResearchCruiseApp.IntegrationTests")]

// The base Roles.resx contains English names; Polish has its own satellite resource.
[assembly: NeutralResourcesLanguage("en")]
