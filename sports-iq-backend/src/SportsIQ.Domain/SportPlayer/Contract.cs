using System.ComponentModel.DataAnnotations.Schema;
using SportsIQ.Domain.Core;

namespace SportsIQ.Domain.SportPlayer;

[Table("Contracts", Schema = "Player")]
public class Contract : BaseEntity
{
	public int ContractID { get; set; }
	public int PlayerID { get; set; }
	public Player Player { get; set; }

	public int YearSigned { get; set; }
	public int Years { get; set; }
	public decimal TotalValue { get; set; }
	public decimal AverageSalary { get; set; }
	public decimal GuaranteedMoney { get; set; }
	public bool IsActive { get; set; }
	public string SourceUrl { get; set; }
	public IEnumerable<ContractYear> ContractYears { get; set; }
	public override int ID => ContractID;
}