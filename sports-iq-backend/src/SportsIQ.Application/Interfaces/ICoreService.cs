using SportsIQ.Domain.Core;

namespace SportsIQ.Application.Interfaces;

public interface ICoreService
{
    Task<IEnumerable<Sport>> GetSports();
    Task<IEnumerable<Season>> GetSeasons();
    Task<IEnumerable<Season>> GetSeasons(int sportID);  
    Task<IEnumerable<Team>> GetTeams(int sportID);
}