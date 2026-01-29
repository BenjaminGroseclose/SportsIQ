using SportsIQ.Application.Interfaces;
using SportsIQ.Domain.Core;
using SportsIQ.Domain.FilterOptions;
using SportsIQ.Domain.SportPlayer;
using SportsIQ.Infrastructure.Interfaces;
using System.Linq.Expressions;
using System.Reflection;

namespace SportsIQ.Application;

public class PlayerService : IPlayerService
{
    private IBaseRepository<Player> playerRepository;

    public PlayerService(IBaseRepository<Player> playerRepository)
    {
        this.playerRepository = playerRepository;
    }

    public async Task<PagedResponse<Player>> GetPlayers(PlayerFilterOptions filterOptions)
    {
        var includes = new List<Expression<Func<Player, object>>>
        {
            p => p.Contracts
        };

        if (filterOptions.IncludeRatings)
        {
            includes.Add(p => p.Ratings);
        }

        var players = await this.playerRepository.GetAllAsync(includes.ToArray());

        if (filterOptions.SportID.HasValue)
        {
            players = players.Where(p => p.SportID == filterOptions.SportID.Value);
        }

        if (filterOptions.TeamIDs != null && filterOptions.TeamIDs.Any())
        {
            players = players.Where(p => p.CurrentTeam != null && filterOptions.TeamIDs.Contains(p.CurrentTeam.ID));
        }

        // Apply sorting if requested (top-level Player properties only)
        if (!string.IsNullOrWhiteSpace(filterOptions.SortBy))
        {
            var prop = typeof(Player).GetProperty(filterOptions.SortBy!, BindingFlags.Public | BindingFlags.Instance | BindingFlags.IgnoreCase);
            if (prop != null)
            {
                players = filterOptions.SortDescending
                    ? players.OrderByDescending(p => prop.GetValue(p))
                    : players.OrderBy(p => prop.GetValue(p));
            }
        }

        if (filterOptions.IncludePagination)
        {
            var offset = (filterOptions.Page - 1) * filterOptions.PageSize;
            players = players.Skip(offset).Take(filterOptions.PageSize);
        }

        return new PagedResponse<Player>(players, players.Count(), filterOptions.Page, filterOptions.PageSize);
    }
}