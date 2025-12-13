using System.ComponentModel.DataAnnotations.Schema;

namespace SportsIQ.Domain.Core;


[Table("Teams", Schema = "Core")]
public class Team : BaseEntity
{
    public int TeamID { get; set; }
    public string Name { get; set; }
    public string City { get; set; }
    public string Abbreviation { get; set; }

    [ForeignKey("Sport")]
    public int SportID { get; set; }
    public Sport Sport { get; set; }
    public string PrimaryColor { get; set; }
    public string SecondaryColor { get; set; }
    public string Logo { get; set; }
    public override int ID => TeamID;
}