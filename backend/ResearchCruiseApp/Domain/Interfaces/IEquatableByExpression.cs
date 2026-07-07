using System.Linq.Expressions;

namespace ResearchCruiseApp.Domain.Interfaces;

public interface IEquatableByExpression<T>
{
    static abstract Expression<Func<T, bool>> EqualsByExpression(T? other);
}
