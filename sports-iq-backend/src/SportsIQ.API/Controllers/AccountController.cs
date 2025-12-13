using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SportsIQ.Application.Interfaces;
using SportsIQ.Domain.Core;

namespace SportsIQ.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AccountController : ControllerBase
{
    private readonly IAccountService _accountService;

    public AccountController(IAccountService accountService)
    {
        _accountService = accountService;
    }

    /// <summary>
    /// Get account by username/email
    /// Requires authentication
    /// </summary>
    [Authorize]
    [HttpGet]
    public async Task<IActionResult> Get()
    {
        var userID = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (userID == null)
        {
            return Unauthorized();
        }

        var account = await _accountService.GetAccountByUserID(userID);
        if (account == null)
        {
            return NotFound();
        }

        return Ok(account);
    }

    /// <summary>
    /// Create a new account
    /// Requires authentication (only authenticated users from Auth0 can create)
    /// </summary>
    [Authorize]
    [HttpPost]
    public IActionResult Create([FromBody] Account account)
    {
        var createdAccount = _accountService.CreateAccount(account);
        return Ok(createdAccount);
    }
}