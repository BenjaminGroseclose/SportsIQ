using SportsIQ.Domain.Ranking;

namespace SportsIQ.Application.Interfaces;

public interface IPlayerRankingService
{
    Task<IEnumerable<PlayerRanking>> GetPlayerRankings(int sport);
    Task<IEnumerable<PlayerRanking>> SavePlayerComparison(PlayerComparison comparison);
    Task<IEnumerable<PlayerComparison>> GetPlayerComparisons(int playerID);
    Task<PlayerComparison> GetRandomPlayerComparison(int sportID);
}