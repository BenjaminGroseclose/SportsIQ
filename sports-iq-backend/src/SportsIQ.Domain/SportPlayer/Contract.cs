using System.ComponentModel.DataAnnotations.Schema;

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

	/// <summary>
	/// Calculates the dead cap for the contract from the current year onward.
	/// </summary>
	/// <param name="currentYear">The year from which to start calculating the dead cap.</param>
	/// <returns>The total dead cap amount from the current year onward.</returns>
	public decimal CalculateDeadCap(int currentYear)
	{
		return this.ContractYears.Where(y => y.Year >= currentYear).Sum(c => c.ProratedSigningBonus ?? 0);
	}

	/// <summary>
	/// Calculates the cap hit for the contract for the specified year.
	/// </summary>
	/// <param name="currentYear">The year for which to calculate the cap hit.</param>
	/// <returns>The cap hit amount for the specified year.</returns>
	public decimal CalculateCapHit(int currentYear)
	{
		var currentYearContract = this.ContractYears.FirstOrDefault(y => y.Year == currentYear);
		return currentYearContract != null ? (currentYearContract.CapNumber ?? 0) : 0;
	}

	public override int ID => ContractID;
}