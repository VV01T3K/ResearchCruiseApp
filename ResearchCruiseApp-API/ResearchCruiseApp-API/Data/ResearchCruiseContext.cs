using Microsoft.EntityFrameworkCore;
using Microsoft.VisualBasic.CompilerServices;
using ResearchCruiseApp_API.Models;

namespace ResearchCruiseApp_API.Data;

public class ResearchCruiseContext(DbContextOptions<ResearchCruiseContext> options) : DbContext(options)
{
}