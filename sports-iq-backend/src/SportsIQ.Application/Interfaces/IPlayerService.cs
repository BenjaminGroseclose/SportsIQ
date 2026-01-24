using SportsIQ.Domain.SportPlayer;

namespace SportsIQ.Application.Interfaces;

public interface IPlayerService
{
    Task<IEnumerable<Player>> GetPlayersBySport(int sportID, bool includeRatings);
    Task<IEnumerable<Player>> GetPlayersByTeam(int teamID, bool includeRatings);
}