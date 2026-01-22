

using System.ComponentModel.DataAnnotations.Schema;
using SportsIQ.Domain.SportPlayer;

namespace SportsIQ.Domain.Ranking;

[Table("PlayerComparisons", Schema = "Ranking")]
public class PlayerComparison : BaseEntity
{
	public int PlayerComparisonID { get; set; }
	public int PlayerAID { get; set; }
	public Player PlayerA { get; set; }
	public int PlayerBID { get; set; }
	public Player PlayerB { get; set; }
	public int WinnerID { get; set; }
	public Player Winner { get { return WinnerID == PlayerAID ? PlayerA : PlayerB; } }
	public double RatingAdjustment { get; set; }
	public DateTimeOffset ComparisonDate { get; set; }

	public override int ID => PlayerComparisonID;
}
