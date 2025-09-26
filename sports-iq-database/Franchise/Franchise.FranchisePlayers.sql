CREATE TABLE [dbo].[Franchise.FranchisePlayers]
(
	[FranchisePlayerID] INT NOT NULL PRIMARY KEY  IDENTITY(1,1),
	[FranchiseID] INT NOT NULL,
	[PlayerID] INT NOT NULL,
	[CreateDate] DATETIMEOFFSET NOT NULL DEFAULT SYSDATETIMEOFFSET(3),
	[LastModified] DATETIMEOFFSET NOT NULL DEFAULT SYSDATETIMEOFFSET(3),

	FOREIGN KEY (FranchiseID) REFERENCES [dbo].[Franchise.Franchises](FranchiseID),
	FOREIGN KEY (PlayerID) REFERENCES [dbo].[Player.Players](PlayerID)
)