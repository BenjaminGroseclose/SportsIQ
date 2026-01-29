using SportsIQ.Domain.Core;
using SportsIQ.Domain.FilterOptions;
using SportsIQ.Domain.SportPlayer;

namespace SportsIQ.Application.Interfaces;

public interface IPlayerService
{
    Task<PagedResponse<Player>> GetPlayers(PlayerFilterOptions filterOptions);
}