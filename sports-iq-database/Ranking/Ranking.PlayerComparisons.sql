CREATE SCHEMA [Ranking];
GO

CREATE TABLE [Ranking].[PlayerComparisons] (
    [ComparisonID] INT NOT NULL PRIMARY KEY IDENTITY(1,1),
    [AccountID] INT NULL,
    [PlayerAID] INT NOT NULL,
    [PlayerBID] INT NOT NULL,
    [WinnerID] INT NOT NULL,
	[RatingAdjustment] FLOAT NOT NULL,
    [ComparisonDate] DATETIMEOFFSET NOT NULL DEFAULT SYSDATETIMEOFFSET(),
    [CreateDate] DATETIMEOFFSET NOT NULL DEFAULT SYSDATETIMEOFFSET(),
    [LastModified] DATETIMEOFFSET,	

    CONSTRAINT [FK_Comparisons_Accounts] FOREIGN KEY (AccountID) REFERENCES [Core].[Accounts](AccountID),
    CONSTRAINT [FK_Comparisons_PlayersA] FOREIGN KEY (PlayerAID) REFERENCES [Player].[Players](PlayerID),
    CONSTRAINT [FK_Comparisons_PlayersB] FOREIGN KEY (PlayerBID) REFERENCES [Player].[Players](PlayerID),
    CONSTRAINT [FK_Comparisons_Winner] FOREIGN KEY (WinnerID) REFERENCES [Player].[Players](PlayerID)
);