using System.ComponentModel.DataAnnotations.Schema;

namespace SportsIQ.Domain.Core;


[Table("Accounts", Schema = "Core")]
public class Account : BaseEntity
{
    public int AccountID { get; set; }
    public string Username { get; set; }
    public string DisplayName { get; set; }
    public string? Email { get; set; }
    public string ProfilePictureUrl { get; set; }
    public DateTimeOffset LastLogin { get; set; }
    public bool IsActive { get; set; }
    public override int ID { get => AccountID; }

    /// <summary>
    /// The unique identifier for the user from the authentication provider (e.g., Auth0)
    /// </summary>
    public string UserID { get; set; }
}