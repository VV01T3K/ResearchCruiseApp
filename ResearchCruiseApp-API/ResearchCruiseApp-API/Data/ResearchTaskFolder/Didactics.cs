using System.ComponentModel.DataAnnotations;

namespace ResearchCruiseApp_API.Data.ResearchTaskFolder;

public class Didactics(int type, string description):OtherTask(type, description) { }