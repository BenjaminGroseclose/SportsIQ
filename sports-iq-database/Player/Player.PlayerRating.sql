CREATE TABLE [Player].[PlayerRatings]
(
    [PlayerRatingID] INT NOT NULL PRIMARY KEY IDENTITY(1,1),
    [PlayerID] INT NOT NULL,
    [Season] INT NOT NULL,
    [SportsIQRating] FLOAT NOT NULL,
    [RawScore] FLOAT NOT NULL,
    [ConfidenceScore] FLOAT NOT NULL,

    [CreateDate] DATETIMEOFFSET NOT NULL DEFAULT SYSDATETIMEOFFSET(),
    [LastModified] DATETIMEOFFSET,

    CONSTRAINT [FK_PlayerRatings_Players] FOREIGN KEY (PlayerID) REFERENCES [Player].[Players](PlayerID)
)