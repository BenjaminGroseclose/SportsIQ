using SportsIQ.Application.Interfaces;
using SportsIQ.Domain.Core;
using SportsIQ.Domain.Core.Enums;
using SportsIQ.Infrastructure.Interfaces;

namespace SportsIQ.Application;

public class CoreService : ICoreService
{
    private readonly IBaseRepository<Team> _teamRepository;
    private readonly IBaseRepository<Sport> _sportRepository;
    private readonly IBaseRepository<Season> _seasonRepository;
    public CoreService(IBaseRepository<Team> teamRepository, IBaseRepository<Sport> sportRepository, IBaseRepository<Season> seasonRepository)
    {
        _teamRepository = teamRepository;
        _sportRepository = sportRepository;
        _seasonRepository = seasonRepository;
    }

    public async Task<IEnumerable<Filter>> GetFilters()
    {
        var teams = await _teamRepository.GetAllAsync();
        var sports = await _sportRepository.GetAllAsync();
        var seasons = await _seasonRepository.GetAllAsync();

        var teamFilter = new Filter(
            "teams", "Teams", teams.Select(t => new FilterOption(t.ID, t.Name, false, t)).ToList(), true
        );

        // TODO: Pre-select user's favorite sports if logged in
        var sportFilter = new Filter(
            "sports", "Sport", sports.Select(s => new FilterOption(s.ID, s.SportName, false)).ToList(), false, FilterLocation.Top
        );

        var seasonFilter = new Filter(
            "seasons", "Seasons", seasons.Select(s => new FilterOption(s.ID, s.Year.ToString(), s.IsCurrent)).ToList(), true, FilterLocation.Top
        );

        return new List<Filter> { teamFilter, sportFilter, seasonFilter };
    }

    public async Task<IEnumerable<Season>> GetSeasons()
    {
        return await _seasonRepository.GetAllAsync();
    }

    public async Task<IEnumerable<Season>> GetSeasons(int sportID)
    {
        return await _seasonRepository.GetAllAsync();
    }

    public Task<IEnumerable<Sport>> GetSports()
    {
        return _sportRepository.GetAllAsync();
    }

    public async Task<IEnumerable<Team>> GetTeams(int sportID)
    {
        var teams = await _teamRepository.GetAllAsync();
        return teams.Where(t => t.SportID == sportID);
    }
}