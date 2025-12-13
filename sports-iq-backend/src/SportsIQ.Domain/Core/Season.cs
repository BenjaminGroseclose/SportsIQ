using System.ComponentModel.DataAnnotations.Schema;

namespace SportsIQ.Domain.Core;


[Table("Seasons", Schema = "Core")]
public class Season : BaseEntity
{
    public int SeasonID { get; set; }
    public int Year { get; set; }

    public int SportID { get; set; }
    public Sport Sport { get; set; }

    public bool IsCurrent { get; set; }
    public override int ID => SeasonID;
}