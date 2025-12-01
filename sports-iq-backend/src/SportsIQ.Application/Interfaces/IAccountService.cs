using SportsIQ.Domain.Core;

namespace SportsIQ.Application.Interfaces;

public interface IAccountService
{
    Task<Account> GetAccountByUsername(string username);
    Task<Account> GetAccountByID(int accountID);
    Task<Account> CreateAccount(Account account);
}