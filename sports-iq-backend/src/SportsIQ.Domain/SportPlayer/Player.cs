using System.ComponentModel.DataAnnotations.Schema;
using SportsIQ.Domain.Core;

namespace SportsIQ.Domain.SportPlayer;

[Table("Players", Schema = "Player")]
public class Player : BaseEntity
{
	public int PlayerID { get; set; }
	public string FirstName { get; set; }
	public string LastName { get; set; }
	public string PlayerName { get; set; }
	public int SportID { get; set; }
	public Sport Sport { get; set; }
	public string Position { get; set; }
	public DateTime? BirthDate { get; set; }
	public string? College { get; set; }
	public string? Height { get; set; }
	public int Weight { get; set; }

	public int StatusID { get; set; }
	public PlayerStatus Status { get; set; }

	public int? JerseyNumber { get; set; }
	public int? RookieYear { get; set; }
	public int? ExperienceYears { get { return RookieYear.HasValue ? DateTime.Now.Year - RookieYear.Value : (int?)null; } }
	public string ExternalPlayerID { get; set; }

	public IEnumerable<Contract> Contracts { get; set; }
	public IEnumerable<PlayerRating> Ratings { get; set; }

	public Team? CurrentTeam
	{
		get
		{
			var currentContract = Contracts?.Where(c => c.IsActive).FirstOrDefault();

			if (currentContract == null)
			{
				return null;
			}

			return currentContract.ContractYears?
				.Where(cy => cy.Year == DateTime.Now.Year)
				.Select(cy => cy.Team)
				.FirstOrDefault();
		}
	}

	public double SportsIQScore { get
		{
			if (Ratings == null || !Ratings.Any())
			{
				return 0;
			}

			// Average of the most recent up to 3 ratings
			return Ratings
				.OrderByDescending(r => r.Season)
				.Take(3)
				.Average(r => r.SportsIQRating);
		}
	 }

	public override int ID => PlayerID;
}

