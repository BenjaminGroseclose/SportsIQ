using SportsIQ.Domain.Core;

namespace SportsIQ.Domain.SportPlayer;

public class Contract
{
	public int ContractID { get; set; }
	public int PlayerID { get; set; }
	public Player Player { get; set; }
	public int TeamID { get; set; }
	public Team Team { get; set; }
}