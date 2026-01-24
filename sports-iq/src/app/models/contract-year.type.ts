/*
	public int ContractYearID { get; set; }
	public int ContractID { get; set; }
	public Contract Contract { get; set; }
	public int Year { get; set; }
	public int TeamID { get; set; }
	public Team Team { get; set; }

	/// <summary>
	/// Base salary for the contract year, in millions.
	/// Moves with trades
	/// </summary>
	public decimal BaseSalary { get; set; }

	/// <summary>
	/// Cap number for the contract year, in millions.
	/// </summary>
	public decimal? CapNumber { get; set; }

	/// <summary>
	/// Cap percent for the contract year (0-100).
	/// </summary>
	public decimal? CapPercent { get; set; }

	/// <summary>
	/// Guaranteed money for the contract year, in millions.
	/// </summary>
	public decimal? GuaranteedMoney { get; set; }

	/// <summary>
	/// Prorated signing bonus for the contract year, in millions.
	/// Stays with the team as dead money
	/// </summary>
	public decimal? ProratedSigningBonus { get; set; }

	/// <summary>
	/// Roster bonus for the contract year, in millions.
	/// Moves with trades usually
	/// </summary>
	public decimal? RosterBonus { get; set; }

	/// <summary>
	/// Cash paid for the contract year, in millions.
	/// </summary>
	public decimal? CashPaid { get; set; }

*/

export interface IContractYear {
  contractYearID: number;
  contractID: number;
  year: number;
  teamID: number;
  baseSalary: number;
  capNumber?: number;
  capPercent?: number;
  guaranteedMoney?: number;
  proratedSigningBonus?: number;
  rosterBonus?: number;
  cashPaid?: number;

  createDate: Date;
  lastModified: Date | null;
}
