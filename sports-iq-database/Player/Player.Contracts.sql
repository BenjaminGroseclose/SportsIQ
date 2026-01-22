-- Create Contracts table (master contract records)
CREATE TABLE [Player].[Contracts]
(
	[ContractID] INT NOT NULL PRIMARY KEY IDENTITY(1,1),
	[PlayerID] INT NOT NULL,
	
	-- Contract Overview
	[YearSigned] INT NOT NULL,
	[Years] INT NOT NULL, -- Contract length
	[TotalValue] DECIMAL(18,2) NOT NULL,
	[AverageSalary] DECIMAL(18,2) NOT NULL, -- APY (Average Per Year)
	[GuaranteedMoney] DECIMAL(18,2) NULL,
	
	-- Status
	[IsActive] BIT NOT NULL DEFAULT 1,
	
	-- External References
	[SourceURL] NVARCHAR(500) NULL,
	
	[CreateDate] DATETIMEOFFSET NOT NULL DEFAULT SYSDATETIMEOFFSET(),
	[LastModified] DATETIMEOFFSET,

	CONSTRAINT [FK_Contracts_Player] FOREIGN KEY ([PlayerID]) REFERENCES [Player].[Players]([PlayerID])
);

