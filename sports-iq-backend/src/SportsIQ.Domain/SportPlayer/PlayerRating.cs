using System.ComponentModel.DataAnnotations.Schema;

namespace SportsIQ.Domain.SportPlayer;

[Table("PlayerRatings", Schema = "Player")]
public class PlayerRating : BaseEntity
{
    public int PlayerRatingID { get; set; }
    public int PlayerID { get; set; }
    public Player Player { get; set; }
    public int Season { get; set; }
    public double SportsIQRating { get; set; }
    public double RawScore { get; set; }
    public double ConfidenceScore { get; set; }
}