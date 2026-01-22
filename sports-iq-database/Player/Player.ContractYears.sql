CREATE TABLE [Player].[ContractYears]
(
    [ContractYearID] INT NOT NULL PRIMARY KEY IDENTITY(1,1),
    [ContractID] INT NOT NULL,
    [Year] INT NOT NULL,
    [TeamID] INT NOT NULL,
    [BaseSalary] DECIMAL(18,2) NOT NULL,
    [CapNumber] DECIMAL(18,2) NULL,
    [CapPercent] DECIMAL(5,2) NULL,
    [GuaranteedMoney] DECIMAL(18,2) NULL,
    [ProratedSigningBonus] DECIMAL(18,2) NULL,
    [RosterBonus] DECIMAL(18,2) NULL,
    [CashPaid] DECIMAL(18,2) NULL,

    [CreateDate] DATETIMEOFFSET NOT NULL DEFAULT SYSDATETIMEOFFSET(),   
	[LastModified] DATETIMEOFFSET,

    CONSTRAINT [FK_ContractYears_Contracts] FOREIGN KEY (ContractID) REFERENCES [Player].[Contracts](ContractID),
    CONSTRAINT [FK_ContractYears_Teams] FOREIGN KEY (TeamID) REFERENCES [Core].[Teams](TeamID)
)