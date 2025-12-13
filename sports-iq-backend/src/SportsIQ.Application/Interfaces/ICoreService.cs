using SportsIQ.Domain.Core;

namespace SportsIQ.Application.Interfaces;

public interface ICoreService
{
    Task<IEnumerable<Filter>> GetFilters();
}