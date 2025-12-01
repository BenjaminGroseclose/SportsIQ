using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SportsIQ.Application.Interfaces;
using SportsIQ.Domain.Core;

namespace SportsIQ.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class AccountController : ControllerBase
{
    private readonly IAccountService _accountService;

    public AccountController(IAccountService accountService)
    {
        _accountService = accountService;
    }

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

    [HttpPost]
    public IActionResult Create([FromBody] Account account)
    {
        var createdAccount = _accountService.CreateAccount(account);
        return Ok(createdAccount);
    }
}