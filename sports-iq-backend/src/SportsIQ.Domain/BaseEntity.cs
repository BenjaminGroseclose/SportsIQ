namespace SportsIQ.Domain;

public class BaseEntity
{
    virtual public int ID { get; }
    public DateTimeOffset CreateDate { get; set; }
    public DateTimeOffset? LastModified { get; set; }
}