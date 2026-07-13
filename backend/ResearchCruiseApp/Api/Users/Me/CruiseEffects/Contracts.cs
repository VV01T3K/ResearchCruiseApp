using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Api.Users;

public sealed record CruiseEffectResponse(
    Guid Id,
    Guid UserId,
    EffectResponse Effect,
    string Points,
    string CruiseApplicationId
)
{
    public static CruiseEffectResponse From(UserEffect effect)
    {
        return new CruiseEffectResponse(
            effect.Id,
            effect.UserId,
            EffectResponse.From(effect.Effect),
            effect.Points.ToString(),
            effect.Effect.FormC.CruiseApplication.Id.ToString()
        );
    }
}

public sealed record EffectResponse(
    string Type,
    string? Title,
    string? Magazine,
    string? Author,
    string? Institution,
    string? Date,
    string? StartDate,
    string? EndDate,
    string? FinancingAmount,
    string? FinancingApproved,
    string? Description,
    string? SecuredAmount,
    string? MinisterialPoints,
    string Done,
    string? PublicationMinisterialPoints,
    string ManagerConditionMet,
    string DeputyConditionMet
)
{
    public static EffectResponse From(ResearchTaskEffect effect)
    {
        var task = effect.ResearchTask;

        return new EffectResponse(
            ((int)task.Type).ToString(),
            task.Title,
            task.Magazine,
            task.Author,
            task.Institution,
            task.Date,
            task.StartDate,
            task.EndDate,
            task.FinancingAmount,
            task.FinancingApproved,
            task.Description,
            task.SecuredAmount,
            task.MinisterialPoints,
            effect.Done,
            effect.PublicationMinisterialPoints,
            effect.ManagerConditionMet,
            effect.DeputyConditionMet
        );
    }
}
