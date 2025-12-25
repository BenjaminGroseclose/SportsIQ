using Microsoft.AspNetCore.Mvc;
using SportsIQ.Application.Interfaces;

namespace SportsIQ.API.Controllers;

    [ApiController]
    [Route("api/[controller]")]
public class PlayerRankingController : ControllerBase
{
    private readonly IPlayerRankingService rankingService;

    public PlayerRankingController(IPlayerRankingService rankingService)
    {
        this.rankingService = rankingService;
    }

    [HttpGet("player-comparison/random/{sportID}")]
    public async Task<IActionResult> GetRandomPlayerComparison(int sportID)
    {
        var comparison = await this.rankingService.GetRandomPlayerComparison(sportID);
        return Ok(comparison);
    }

    [HttpGet("{sportID}")]
    public async Task<IActionResult> GetPlayerRankings(int sportID)
    {
        var rankings = await this.rankingService.GetPlayerRankings(sportID);
        return Ok(rankings);
    }
}