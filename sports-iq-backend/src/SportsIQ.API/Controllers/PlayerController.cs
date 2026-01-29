using Microsoft.AspNetCore.Mvc;
using SportsIQ.Application.Interfaces;
using SportsIQ.Domain.FilterOptions;

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

    [HttpGet]
    public async Task<IActionResult> GetPlayersBySport([FromQuery] PlayerFilterOptions filterOptions)
    {
        return Ok(await this.playerService.GetPlayers(filterOptions));
    }
}