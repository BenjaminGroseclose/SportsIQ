CREATE SCHEMA [Player];
GO

CREATE TABLE [Player].[Players]
(
	[PlayerID] INT NOT NULL PRIMARY KEY  IDENTITY(1,1),
	[FirstName] NVARCHAR(100) NOT NULL,
	[LastName] NVARCHAR(100) NOT NULL,
	[SportID] INT NOT NULL,
	[Position] VARCHAR(50) NOT NULL,
	[BirthDate] DATE NULL,
	[College] NVARCHAR(100) NULL,
	[TeamID] INT NULL,

	[Height] NVARCHAR(50) NULL,
	[Weight] INT NULL,
	[StatusID] INT NOT NULL,
	[JerseyNumber] INT NULL,
	[RookieYear] INT NULL,

	[ExternalPlayerID] VARCHAR(100) NULL,

	[CreateDate] DATETIMEOFFSET NOT NULL DEFAULT SYSDATETIMEOFFSET(),
	[LastModified] DATETIMEOFFSET,

	CONSTRAINT [FK_Players_Sport] FOREIGN KEY (SportID) REFERENCES [Core].[Sports](SportID),
	CONSTRAINT [FK_Players_Team] FOREIGN KEY (TeamID) REFERENCES [Core].[Teams](TeamID),
	CONSTRAINT [FK_Players_Status] FOREIGN KEY (StatusID) REFERENCES [Player].[PlayerStatus](PlayerStatusID)
)