using System.ComponentModel.DataAnnotations.Schema;
using SportsIQ.Domain.SportPlayer;

namespace SportsIQ.Domain.PlayerRanking;

[Table("Rankings", Schema = "Ranking")]
public class Ranking : BaseEntity
{
    public int RankingID { get; set; }
    public int PlayerID { get; set; }
    public Player Player { get; set; }
    public double Rating { get; set; }

    public override int ID => RankingID;
}