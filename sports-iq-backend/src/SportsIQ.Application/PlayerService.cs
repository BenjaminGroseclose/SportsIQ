using SportsIQ.Application.Interfaces;
using SportsIQ.Domain.SportPlayer;
using SportsIQ.Infrastructure.Interfaces;
using System.Linq.Expressions;

namespace SportsIQ.Application;

public class PlayerService : IPlayerService
{
    private IBaseRepository<Player> playerRepository;

    public PlayerService(IBaseRepository<Player> playerRepository)
    {
        this.playerRepository = playerRepository;
    }

    public async Task<IEnumerable<Player>> GetPlayersBySport(int sportID, bool includeRatings)
    {
        var includes = new List<Expression<Func<Player, object>>>
        {
            p => p.Contracts
        };

        if (includeRatings)
        {
            includes.Add(p => p.Ratings);
        }

        var players = await this.playerRepository.GetAllAsync(includes.ToArray());

        return players.Where(p => p.SportID == sportID);
    }

    public async Task<IEnumerable<Player>> GetPlayersByTeam(int teamID, bool includeRatings)
    {
        var includes = new List<Expression<Func<Player, object>>>
        {
            p => p.Contracts
        };

        if (includeRatings)
        {
            includes.Add(p => p.Ratings);
        }

        var players = await this.playerRepository.GetAllAsync(includes.ToArray());

        return players.Where(p => p.CurrentTeam?.ID == teamID);
    }
}