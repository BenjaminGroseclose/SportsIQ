using Microsoft.AspNetCore.Mvc;
using SportsIQ.Application.Interfaces;

namespace SportsIQ.API.Controllers
{
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

        [HttpGet("filters")]
        public async Task<IActionResult> GetFilters()
        {
            return Ok(await this.coreService.GetFilters());
        }
    }
}