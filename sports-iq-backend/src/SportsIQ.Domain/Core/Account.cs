namespace SportsIQ.Domain.Core;

public class Account : BaseModel
{
    public int AccountID { get; set; }
    public string Username { get; set; }
    public string DisplayName { get; set; }
    public string? Email { get; set; }
    public string ProfilePictureUrl { get; set; }
    public DateTimeOffset LastLogin { get; set; }
    public bool IsActive { get; set; }
    public override int ID { get => AccountID; }
}