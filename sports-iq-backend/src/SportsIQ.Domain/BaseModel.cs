namespace SportsIQ.Domain;

public class BaseModel
{
    virtual public int ID { get; }
    public DateTimeOffset CreateDate { get; set; }
    public DateTimeOffset? LastModified { get; set; }
}