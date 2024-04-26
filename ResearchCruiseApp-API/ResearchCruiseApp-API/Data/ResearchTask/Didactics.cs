using System.ComponentModel.DataAnnotations;

namespace ResearchCruiseApp_API.Data.ResearchTask;

public class Didactics(int type, string description):OtherTask(type, description) { }