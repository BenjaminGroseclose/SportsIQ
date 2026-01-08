CREATE TABLE [Core].[Positions]
(
    [PositionID] INT NOT NULL PRIMARY KEY IDENTITY(1,1),
    [SportID] INT NOT NULL,
    [PositionName] VARCHAR(50) NOT NULL,
    [DisplayOrder] INT NOT NULL,
    [IsFantasyRelevant] BIT NOT NULL DEFAULT 0,
    [CreateDate] DATETIMEOFFSET NOT NULL DEFAULT SYSDATETIMEOFFSET(),
    [LastModified] DATETIMEOFFSET,

    CONSTRAINT [FK_Positions_Sport] FOREIGN KEY ([SportID]) REFERENCES [Core].[Sports]([SportID])
)