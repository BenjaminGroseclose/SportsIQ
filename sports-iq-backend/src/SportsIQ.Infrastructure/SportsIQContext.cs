using Microsoft.EntityFrameworkCore;
using SportsIQ.Domain.Core;
using SportsIQ.Domain.Ranking;
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
	public DbSet<Contract> Contracts { get; set; }

	// Ranking
	public DbSet<PlayerRanking> Rankings { get; set; }
	public DbSet<PlayerComparison> PlayerComparisons { get; set; }

	protected override void OnModelCreating(ModelBuilder modelBuilder)
	{
		base.OnModelCreating(modelBuilder);

		// Auto-include common Player navigations to avoid repetitive Includes
		modelBuilder.Entity<Player>()
			.HasMany(p => p.Contracts)
			.WithOne(c => c.Player)
			.HasForeignKey(c => c.PlayerID);

		modelBuilder.Entity<Player>()
			.HasMany(p => p.Rankings)
			.WithOne(pr => pr.Player)
			.HasForeignKey(pr => pr.PlayerID);

		modelBuilder.Entity<Player>()
			.Navigation(p => p.Sport)
			.AutoInclude();

		modelBuilder.Entity<Player>()
			.Navigation(p => p.Status)
			.AutoInclude();

		modelBuilder.Entity<Team>()
			.Navigation(t => t.Sport)
			.AutoInclude();

		modelBuilder.Entity<Season>()
			.Navigation(s => s.Sport)
			.AutoInclude();
	}
}