using System.Linq.Expressions;
namespace SportsIQ.Infrastructure.Interfaces;

public interface IBaseRepository<T> where T : class
{
    Task<T> GetByIdAsync(int id, params Expression<Func<T, object>>[] includes);
    Task<IEnumerable<T>> GetAllAsync(params Expression<Func<T, object>>[] includes);
    Task<int> AddAsync(T entity);
    void Update(T entity);
    void Delete(T entity);
}