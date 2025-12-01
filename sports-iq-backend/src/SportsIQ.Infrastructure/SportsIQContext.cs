using Microsoft.EntityFrameworkCore;
using SportsIQ.Domain.Core;

namespace SportsIQ.Infrastructure;

public class SportsIQContext : DbContext
{
    public SportsIQContext(DbContextOptions<SportsIQContext> options) : base(options)
    {
    }

    // Core
    public DbSet<Account> Accounts { get; set; }
    public DbSet<TransactionType> TransactionTypes { get; set; }
}