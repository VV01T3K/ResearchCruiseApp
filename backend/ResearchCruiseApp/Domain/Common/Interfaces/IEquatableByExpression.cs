using System.Linq.Expressions;

namespace ResearchCruiseApp.Domain.Common.Interfaces;

public interface IEquatableByExpression<T>
{
    static abstract Expression<Func<T, bool>> EqualsByExpression(T? other);
}
