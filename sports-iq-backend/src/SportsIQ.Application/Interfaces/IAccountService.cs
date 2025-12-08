using SportsIQ.Domain.Core;

namespace SportsIQ.Application.Interfaces;

public interface IAccountService
{
    Task<Account> GetAccountByUserID(string userID);
    Task<Account> CreateAccount(Account account);
}