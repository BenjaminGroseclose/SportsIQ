namespace SportsIQ.Domain.Core;

public class TransactionType : BaseModel
{
    public int TransactionTypeID { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
}