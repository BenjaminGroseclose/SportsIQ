CREATE PROCEDURE [Player].[UpsertPlayer]
	@FirstName NVARCHAR(100) = NULL,
	@LastName NVARCHAR(100) = NULL,
	@PlayerName NVARCHAR(200) = NULL,
	@SportID INT = NULL,
	@Position VARCHAR(50) = NULL,
	@BirthDate DATE = NULL,
	@College NVARCHAR(100) = NULL,
	@Team NVARCHAR(100) = NULL,
	@Height NVARCHAR(50) = NULL,
	@Weight INT = NULL,
	@ExternalPlayerID NVARCHAR(100) = NULL,
	@Status NVARCHAR(250) = NULL,
	@Jersey INT = NULL,
	@RookieYear INT = NULL
AS
BEGIN

	DECLARE @TeamID INT = NULL;
	DECLARE @StatusID INT = 5; -- Inactive
	DECLARE @PlayerID INT = NULL;

	SELECT @TeamID = TeamID FROM Core.Teams WHERE Abbreviation = @Team;
	SELECT @StatusID = ps.PlayerStatusID FROM Player.PlayerStatuses ps WHERE ps.Name = @Status;

	-- Upsert: Update if ExternalPlayerID exists, otherwise insert
	IF EXISTS (SELECT 1 FROM [Player].[Players] WHERE ExternalPlayerID = @ExternalPlayerID)
	BEGIN
		UPDATE p
		SET 
			FirstName = COALESCE(@FirstName, p.FirstName),
			LastName = COALESCE(@LastName, p.LastName),
			PlayerName = COALESCE(@PlayerName, p.PlayerName),
			SportID = COALESCE(@SportID, p.SportID),
			BirthDate = COALESCE(@BirthDate, p.BirthDate),
			College = COALESCE(@College, p.College),
			TeamID = COALESCE(@TeamID, p.TeamID),
			Height = COALESCE(@Height, p.Height),
			[Weight] = COALESCE(@Weight, p.[Weight]),
			StatusID = COALESCE(@StatusID, p.StatusID),
			JerseyNumber = COALESCE(@Jersey, p.JerseyNumber),
			RookieYear = COALESCE(@RookieYear, p.RookieYear),
			LastModified = SYSDATETIMEOFFSET()
		FROM [Player].[Players] p
		WHERE p.ExternalPlayerID = @ExternalPlayerID;
		
		SELECT @PlayerID = PlayerID FROM [Player].[Players] WHERE ExternalPlayerID = @ExternalPlayerID;
	END
	ELSE
	BEGIN
		INSERT INTO [Player].[Players] (FirstName, LastName, PlayerName, SportID, BirthDate, College, TeamID, Height, [Weight], ExternalPlayerID, StatusID, JerseyNumber, RookieYear)
		VALUES 
		(
			@FirstName,
			@LastName,
			@PlayerName,
			@SportID,
			@BirthDate,
			@College,
			@TeamID,
			@Height,
			@Weight,
			@ExternalPlayerID,
			@StatusID,
			@Jersey,
			@RookieYear
		);
		
		SET @PlayerID = SCOPE_IDENTITY();
	END

	-- Handle comma-separated positions
	IF @Position IS NOT NULL AND @PlayerID IS NOT NULL
	BEGIN
		-- Delete existing position associations
		DELETE FROM [Player].[PlayerPositions] WHERE PlayerID = @PlayerID;
		
		-- Insert new positions from comma-separated list
		INSERT INTO [Player].[PlayerPositions] (PlayerID, PositionID)
		SELECT @PlayerID, p.PositionID
		FROM STRING_SPLIT(@Position, ',') s
		INNER JOIN Core.Positions p ON TRIM(s.value) = p.PositionName
		WHERE p.PositionID IS NOT NULL;
	END
END
