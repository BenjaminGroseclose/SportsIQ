using System.ComponentModel.DataAnnotations.Schema;

namespace SportsIQ.Domain.Core;

[Table("Sports", Schema = "Core")]
public class Sport : BaseEntity
{
    public int SportID { get; set; }
    public string SportName { get; set; }
    public string Abbreviation { get; set; }
    public override int ID => SportID;
}