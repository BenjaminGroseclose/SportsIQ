using Microsoft.EntityFrameworkCore;
using SportsIQ.Domain.Core;
using SportsIQ.Domain.PlayerRanking;
using SportsIQ.Domain.SportPlayer;

namespace SportsIQ.Infrastructure;

public class SportsIQContext : DbContext
{
    public SportsIQContext(DbContextOptions<SportsIQContext> options) : base(options)
    {
    }

    // Core
    public DbSet<Account> Accounts { get; set; }
    public DbSet<Sport> Sports { get; set; }
    public DbSet<Team> Teams { get; set; }
    public DbSet<Season> Seasons { get; set; }
    public DbSet<TransactionType> TransactionTypes { get; set; }

    // Player
    public DbSet<Player> Players { get; set; }
    public DbSet<PlayerStatus> PlayerStatuses { get; set; }

    // Ranking
    public DbSet<PlayerRanking> Rankings { get; set; }
    public DbSet<PlayerComparison> PlayerComparisons { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Team>()
            .HasOne(t => t.Sport)
            .WithMany()
            .HasForeignKey(t => t.SportID);

        modelBuilder.Entity<Season>()
            .HasOne(s => s.Sport)
            .WithMany()
            .HasForeignKey(s => s.SportID);
    }
}