using Microsoft.EntityFrameworkCore;
using SportsIQ.Domain;
using SportsIQ.Infrastructure.Interfaces;

namespace SportsIQ.Infrastructure;

public class BaseRepository<T> : IBaseRepository<T> where T : BaseModel
{
    protected readonly SportsIQContext _context;
    protected readonly DbSet<T> _dbSet;

    public BaseRepository(SportsIQContext context)
    {
        _context = context;
        _dbSet = context.Set<T>();
    }

    public async Task<int> AddAsync(T entity)
    {
        await _dbSet.AddAsync(entity);
        await _context.SaveChangesAsync();
        return entity.ID;
    }

    public void Delete(T entity)
    {
        _dbSet.Remove(entity);
        _context.SaveChanges();
    }

    public async Task<IEnumerable<T>> GetAllAsync()
    {
        return await _dbSet.ToListAsync();
    }

    public async Task<T> GetByIdAsync(int id)
    {
        var entity = await _dbSet.FindAsync(id);

        if (entity == null)
        {
            throw new KeyNotFoundException($"Entity with id {id} not found.");
        }

        return entity;
    }

    public void Update(T entity)
    {
        _dbSet.Update(entity);
        _context.SaveChanges();
    }
}