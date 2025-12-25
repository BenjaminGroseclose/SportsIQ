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
	@Jersey INT = NULL
AS
BEGIN

	DECLARE @TeamID INT = NULL;
	DECLARE @StatusID INT = 5; -- Inactive

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
			Position = COALESCE(@Position, p.Position),
			BirthDate = COALESCE(@BirthDate, p.BirthDate),
			College = COALESCE(@College, p.College),
			TeamID = COALESCE(@TeamID, p.TeamID),
			Height = COALESCE(@Height, p.Height),
			[Weight] = COALESCE(@Weight, p.[Weight]),
			StatusID = COALESCE(@StatusID, p.StatusID),
			JerseyNumber = COALESCE(@Jersey, p.JerseyNumber),
			LastModified = SYSDATETIMEOFFSET()
		FROM [Player].[Players] p
		WHERE p.ExternalPlayerID = @ExternalPlayerID;
	END
	ELSE
	BEGIN
		INSERT INTO [Player].[Players] (FirstName, LastName, PlayerName, SportID, Position, BirthDate, College, TeamID, Height, [Weight], ExternalPlayerID, StatusID, JerseyNumber)
		VALUES 
		(
			@FirstName,
			@LastName,
			@PlayerName,
			@SportID,
			@Position,
			@BirthDate,
			@College,
			@TeamID,
			@Height,
			@Weight,
			@ExternalPlayerID,
			@StatusID,
			@Jersey
		);
	END
END
