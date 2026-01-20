-- Create Contracts table (master contract records)
CREATE TABLE [Player].[Contracts]
(
	[ContractID] INT NOT NULL PRIMARY KEY IDENTITY(1,1),
	[PlayerID] INT NOT NULL,
	[TeamID] INT NOT NULL,
	
	-- Contract Overview
	[YearSigned] INT NOT NULL,
	[Years] INT NOT NULL, -- Contract length
	[TotalValue] DECIMAL(18,2) NOT NULL,
	[AverageSalary] DECIMAL(18,2) NOT NULL, -- APY (Average Per Year)
	[GuaranteedMoney] DECIMAL(18,2) NULL,
	
	-- Inflation-Adjusted Values
	[InflatedValue] DECIMAL(18,2) NULL,
	[InflatedAPY] DECIMAL(18,2) NULL,
	[InflatedGuaranteed] DECIMAL(18,2) NULL,
	
	-- Cap Context (at time of signing)
	[APYCapPercent] DECIMAL(10,2) NULL, -- APY as % of cap at signing
	
	-- Status
	[IsActive] BIT NOT NULL DEFAULT 1,
	
	-- External References
	[SourceURL] NVARCHAR(500) NULL,
	
	[CreateDate] DATETIMEOFFSET NOT NULL DEFAULT SYSDATETIMEOFFSET(),
	[LastModified] DATETIMEOFFSET,

	CONSTRAINT [FK_Contracts_Player] FOREIGN KEY ([PlayerID]) REFERENCES [Player].[Players]([PlayerID])
);

