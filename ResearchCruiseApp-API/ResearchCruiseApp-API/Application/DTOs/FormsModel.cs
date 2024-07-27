using System.ComponentModel.DataAnnotations;
using ResearchCruiseApp_API.Application.DTOs.DataTypes;
using ResearchCruiseApp_API.Domain.Common.Interfaces;
using ResearchCruiseApp_API.Models.DataTypes;

namespace ResearchCruiseApp_API.Application.DTOs;


public class EvaluatedResearchTask : ResearchTask , IEvaluatedField
{
    public Guid Id;
    public ResearchTask ResearchTask { get; set; }
    public int CalculatedPoints { get; set; }

    public EvaluatedResearchTask(ResearchTask task, int calculatedPoints)
    {
        ResearchTask = task;
        CalculatedPoints = calculatedPoints;
    }
}

public class EvaluatedContract : Contract, IEvaluatedField
{
    public Guid Id;
    public int CalculatedPoints { get; set; }
    public Contract Contract { get; set; }

    public EvaluatedContract(Contract contract, int calculatedPoints)
    {
        this.Contract = contract;
        this.CalculatedPoints = calculatedPoints;
    }
}

public class EvaluatedPublication : Publication, IEvaluatedField
{
    public Guid Id;
    public Publication Publication { get; set; }
    public int CalculatedPoints { get; set; }

    public EvaluatedPublication(Publication publication, int calculatedPoints)
    {
        this.Publication = publication;
        this.CalculatedPoints = calculatedPoints;
    }
}

public class EvaluatedSpubTask : SpubTask, IEvaluatedField
{
    public Guid Id;
    public SpubTask SpubTask { get; set; }
    public int CalculatedPoints { get; set; }

    public EvaluatedSpubTask(SpubTask spubTask, int calculatedPoints)
    {
        this.SpubTask = spubTask;
        this.CalculatedPoints = calculatedPoints;
    }
}