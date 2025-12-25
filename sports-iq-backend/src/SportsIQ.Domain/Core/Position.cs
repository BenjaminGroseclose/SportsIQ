namespace SportsIQ.Domain.Core;

public class Position : BaseEntity
{
    public int PositionID { get; set; }
    public string PositionName { get; set; }
    public int SportID { get; set; }
    public Sport Sport { get; set; }
    public int DisplayOrder { get; set; }
    public override int ID => PositionID;
}