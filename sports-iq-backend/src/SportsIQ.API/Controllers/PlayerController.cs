using Microsoft.AspNetCore.Mvc;
using SportsIQ.Application.Interfaces;

namespace SportsIQ.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PlayerController : ControllerBase
{
    private readonly IPlayerService playerService;

    public PlayerController(IPlayerService playerService)
    {
        this.playerService = playerService;
    }

    [HttpGet("sport/{sportID}")]
    public async Task<IActionResult> GetPlayersBySport(int sportID, [FromQuery] bool includeRatings = false)
    {
        return Ok(await this.playerService.GetPlayersBySport(sportID, includeRatings));
    }

    [HttpGet("team/{teamID}")]
    public async Task<IActionResult> GetPlayersByTeam(int teamID, [FromQuery] bool includeRatings = false)
    {
        return Ok(await this.playerService.GetPlayersByTeam(teamID, includeRatings));
    }
}