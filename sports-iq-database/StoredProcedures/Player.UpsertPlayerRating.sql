CREATE PROCEDURE [Player].[UpsertPlayerRating]
    @ExternalPlayerID NVARCHAR(100) = NULL,
    @Season INT,
    @SportsIQRating DECIMAL(5,2),
    @RawScore DECIMAL(5,2) = NULL,
    @ConfidenceScore DECIMAL(5,2) = NULL

AS
BEGIN

    DECLARE @PlayerID INT = NULL;

    SELECT @PlayerID = PlayerID FROM [Player].[Players] WHERE ExternalPlayerID = @ExternalPlayerID;

    IF @PlayerID IS NULL
    BEGIN
        SELECT NULL AS PlayerRatingID;
        RETURN;
    END

    -- Upsert: Update if PlayerID + Season exists, otherwise insert
    IF EXISTS (SELECT 1 FROM [Player].[PlayerRatings] WHERE PlayerID = @PlayerID AND Season = @Season)
    BEGIN
        UPDATE pr
        SET 
            SportsIQRating = @SportsIQRating,
            RawScore = COALESCE(@RawScore, pr.RawScore),
            ConfidenceScore = COALESCE(@ConfidenceScore, pr.ConfidenceScore),
            LastModified = SYSDATETIMEOFFSET()
        FROM [Player].[PlayerRatings] pr
        WHERE pr.PlayerID = @PlayerID AND pr.Season = @Season;

        SELECT PlayerRatingID 
        FROM [Player].[PlayerRatings] 
        WHERE PlayerID = @PlayerID AND Season = @Season;
    END
    ELSE
    BEGIN
        INSERT INTO [Player].[PlayerRatings] (PlayerID, Season, SportsIQRating, RawScore, ConfidenceScore, LastModified)
        VALUES (@PlayerID, @Season, @SportsIQRating, @RawScore, @ConfidenceScore, SYSDATETIMEOFFSET());

        SELECT SCOPE_IDENTITY() AS PlayerRatingID;
    END
END