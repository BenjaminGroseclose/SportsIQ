using System.ComponentModel.DataAnnotations.Schema;
using SportsIQ.Domain.SportPlayer;

namespace SportsIQ.Domain.Ranking;

[Table("PlayerRankings", Schema = "Ranking")]
public class PlayerRanking : BaseEntity
{
	public int PlayerRankingID { get; set; }
	public int PlayerID { get; set; }
	public Player Player { get; set; }
	public double Rating { get; set; }
	public override int ID => PlayerRankingID;

	[NotMapped]
	public int Ranking { get; set; }
}