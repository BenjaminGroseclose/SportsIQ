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
    [HttpGet("{username}")]
    public IActionResult Get(string username)
    {
        var account = _accountService.GetAccountByUsername(username);
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