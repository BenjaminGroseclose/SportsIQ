using System.ComponentModel.DataAnnotations.Schema;

namespace SportsIQ.Domain.SportPlayer;

[Table("PlayerStatuses", Schema = "Player")]
public class PlayerStatus : BaseEntity
{
    public int PlayerStatusID { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public bool InjuredListEligible { get; set; }

    public override int ID => PlayerStatusID;
}