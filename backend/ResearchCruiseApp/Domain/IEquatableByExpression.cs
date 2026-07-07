using System.Linq.Expressions;

namespace ResearchCruiseApp.Domain;

public interface IEquatableByExpression<T>
{
    static abstract Expression<Func<T, bool>> EqualsByExpression(T? other);
}
