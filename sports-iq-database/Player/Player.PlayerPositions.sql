CREATE TABLE [Player].[PlayerPositions] (
	[PlayerPositionID] INT PRIMARY KEY IDENTITY(1,1) ,
	[PlayerID] INT NOT NULL,
	[PositionName] NVARCHAR(50) NOT NULL,
	
	[CreateDate] DATETIMEOFFSET NOT NULL DEFAULT SYSDATETIMEOFFSET(),
	[LastModified] DATETIMEOFFSET,

	CONSTRAINT [FK_PlayerPositions_Players] FOREIGN KEY (PlayerID) REFERENCES [Player].[Players](PlayerID)
);
