using SportsIQ.Application.Interfaces;
using SportsIQ.Domain.Core;
using Microsoft.Extensions.Logging;
using SportsIQ.Infrastructure.Interfaces;

namespace SportsIQ.Application;

public class AccountService : IAccountService
{
    private readonly ILogger<AccountService> _logger;
    private readonly IBaseRepository<Account> _accountRepository;

    public AccountService(ILogger<AccountService> logger, IBaseRepository<Account> accountRepository)
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

    public async Task<Account> GetAccountByUserID(string userID)
    {
        var accounts = await _accountRepository.GetAllAsync();
        var account = accounts.FirstOrDefault(a => a.UserID == userID);

        if (account == null)
        {
            throw new KeyNotFoundException($"Account with userID {userID} not found.");
        }

        return account;
    }
}