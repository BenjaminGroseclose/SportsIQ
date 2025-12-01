using SportsIQ.Domain.Core;
using SportsIQ.Infrastructure.Interfaces;

namespace SportsIQ.Infrastructure.Repositories;

public class AccountRepository : BaseRepository<Account>, IAccountRepository
{
    public AccountRepository(SportsIQContext context) : base(context) { }
}