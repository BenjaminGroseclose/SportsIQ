namespace SportsIQ.Infrastructure.Interfaces;

public interface IBaseRepository<T> where T : class
{
    Task<T> GetByIdAsync(int id);
    Task<IEnumerable<T>> GetAllAsync();
    Task<int> AddAsync(T entity);
    void Update(T entity);
    void Delete(T entity);
}