CREATE TABLE [dbo].[Ranking.Comparisons] (
    [ComparisonID] INT NOT NULL PRIMARY KEY IDENTITY(1,1),
    [UserID] INT NOT NULL,
    [PlayerAID] INT NOT NULL,
    [PlayerBID] INT NOT NULL,
    [ChosenPlayerID] INT NOT NULL,
    [ComparisonDate] DATETIMEOFFSET NOT NULL DEFAULT SYSDATETIMEOFFSET(3),
    [CreateDate] DATETIMEOFFSET NOT NULL DEFAULT SYSDATETIMEOFFSET(3),

    FOREIGN KEY (UserID) REFERENCES [dbo].[Core.Users](UserID),
    FOREIGN KEY (PlayerAID) REFERENCES [dbo].[Player.Players](PlayerID),
    FOREIGN KEY (PlayerBID) REFERENCES [dbo].[Player.Players](PlayerID),
    FOREIGN KEY (ChosenPlayerID) REFERENCES [dbo].[Player.Players](PlayerID)
);