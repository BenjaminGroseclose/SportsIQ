using Microsoft.AspNetCore.Mvc;
using SportsIQ.Application.Interfaces;

namespace SportsIQ.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CoreController : ControllerBase
{
    private readonly ICoreService coreService;

    public CoreController(ICoreService coreService)
    {
        this.coreService = coreService;
    }

    [HttpGet("health")]
    public IActionResult HealthCheck()
    {
        return Ok("SportsIQ API is running.");
    }

    [HttpGet("sports")]
    public async Task<IActionResult> GetSports()
    {
        return Ok(await this.coreService.GetSports());
    }

    [HttpGet("seasons/{sportID}")]
    public async Task<IActionResult> GetSeasons(int sportID)
    {
        return Ok(await this.coreService.GetSeasons(sportID));
    }

    [HttpGet("seasons/all")]
    public async Task<IActionResult> GetAllSeasons()
    {
        return Ok(await this.coreService.GetSeasons());
    }

    [HttpGet("teams/{sportID}")]
    public async Task<IActionResult> GetTeams(int sportID)
    {
        return Ok(await this.coreService.GetTeams(sportID));
    }
}
