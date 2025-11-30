using Microsoft.AspNetCore.Mvc;
using SportsIQ.API.Models;

namespace SportsIQ.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class WeatherForecastController : ControllerBase
{
    private readonly ILogger<WeatherForecastController> _logger;

    private static readonly string[] WeatherConditions = 
    {
        "Freezing", "Bracing", "Chilly", "Cool", "Mild", 
        "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
    };

    public WeatherForecastController(ILogger<WeatherForecastController> logger)
    {
        _logger = logger;
    }

    [HttpGet(Name = "GetWeatherForecast")]
    public ActionResult<IEnumerable<WeatherForecast>> GetForecast()
    {
        var forecasts = Enumerable.Range(1, 5).Select(offset => new WeatherForecast
        {
            Date = DateOnly.FromDateTime(DateTime.Now.AddDays(offset)),
            TemperatureC = Random.Shared.Next(-20, 55),
            Summary = WeatherConditions[Random.Shared.Next(WeatherConditions.Length)]
        }).ToList();

        return Ok(forecasts);
    }
}
