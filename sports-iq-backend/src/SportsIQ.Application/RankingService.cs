using SportsIQ.Application.Interfaces;
using SportsIQ.Domain.PlayerRanking;
using SportsIQ.Infrastructure.Interfaces;

namespace SportsIQ.Application;

public class RankingService : IRankingService
{
    private IBaseRepository<PlayerRanking> _playerRankingRepository;
    private IBaseRepository<PlayerComparison> _playerComparisonRepository;
    public RankingService(IBaseRepository<PlayerRanking> playerRankingRepository, IBaseRepository<PlayerComparison> playerComparisonRepository)
    {
        _playerRankingRepository = playerRankingRepository;
        _playerComparisonRepository = playerComparisonRepository;
    }

    public async Task<PlayerComparison> GetRandomPlayerComparison(int sportID)
    {
        // 1. Get all player rankings for the sport
        var allRankings = await this.GetPlayerRankings(sportID);

        // 2. Random select first player
        var playerA = allRankings.OrderBy(x => Guid.NewGuid()).First();

        // 3. Select second player within certain range of first player's ranking
        var playerB = allRankings
            .Where(x => x.Rating >= playerA.Rating - 100 && x.Rating <= playerA.Rating + 100 && x.PlayerID != playerA.PlayerID)
            .OrderBy(x => Guid.NewGuid())
            .First();

        // 4. Return comparison object
        return new PlayerComparison()
        {
            PlayerAID = playerA.PlayerID,
            PlayerA = playerA.Player,
            PlayerBID = playerB.PlayerID,
            PlayerB = playerB.Player,
            ComparisonDate = DateTimeOffset.UtcNow
        };
    }

    public async Task<IEnumerable<PlayerRanking>> GetPlayerRankings(int sport)
    {
        var rankings = await _playerRankingRepository.GetAllAsync();
        return rankings.Where(r => r.Player.SportID == sport).OrderBy(x => x.Rating);
    }

    public Task<IEnumerable<PlayerRanking>> SavePlayerComparison(PlayerComparison comparison)
    {
        throw new NotImplementedException();
    }

    public async Task<IEnumerable<PlayerComparison>> GetPlayerComparisons(int playerID)
    {
        var comparisons = await _playerComparisonRepository.GetAllAsync();
        return comparisons.Where(c => c.PlayerAID == playerID || c.PlayerBID == playerID);
    }
}