using System.ComponentModel.DataAnnotations.Schema;
using SportsIQ.Domain.Core;

namespace SportsIQ.Domain.SportPlayer;

[Table("Players", Schema = "Player")]
public class Player : BaseEntity
{
    public int PlayerID { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string FullName { get { return $"{FirstName} {LastName}"; } }
    public int SportID { get; set; }
    public Sport Sport { get; set; }
    public string Position { get; set; }
    public DateOnly BirthDate { get; set; }
    public string College { get; set; }
    public int? TeamID { get; set; }
    public Team Team { get; set; }
    public string Height { get; set; }
    public int Weight { get; set; }

    public int StatusID { get; set; }
    public PlayerStatus Status { get; set; }

    public int JerseyNumber { get; set; }
    public int RookieYear { get; set; }
    public int ExperienceYears { get { return DateTime.Now.Year - RookieYear; } }
    public string ExternalPlayerID { get; set; }
    public override int ID => PlayerID;
}

