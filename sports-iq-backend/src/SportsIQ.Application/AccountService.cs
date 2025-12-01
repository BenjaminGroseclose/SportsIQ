using SportsIQ.Application.Interfaces;
using SportsIQ.Domain.Core;
using Microsoft.Extensions.Logging;
using SportsIQ.Infrastructure.Interfaces;

namespace SportsIQ.Application;

public class AccountService : IAccountService
{
    private readonly ILogger<AccountService> _logger;
    private readonly IAccountRepository _accountRepository;

    public AccountService(ILogger<AccountService> logger, IAccountRepository accountRepository)
    {
        _logger = logger;
        _accountRepository = accountRepository;
    }

    public async Task<Account> CreateAccount(Account account)
    {
        try
        {
            var accountId = await _accountRepository.AddAsync(account);
            return await _accountRepository.GetByIdAsync(accountId);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating account");
            throw;
        }
    }

    public async Task<Account> GetAccountByID(int accountID)
    {
        return await _accountRepository.GetByIdAsync(accountID);
    }

    public async Task<Account> GetAccountByUsername(string username)
    {
        var accounts = await _accountRepository.GetAllAsync();
        var account = accounts.FirstOrDefault(a => a.Username == username);

        if (account == null)
        {
            throw new KeyNotFoundException($"Account with username {username} not found.");
        }

        return account;
    }
}