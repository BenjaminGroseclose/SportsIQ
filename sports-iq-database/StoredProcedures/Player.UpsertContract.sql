CREATE PROCEDURE [Player].[UpsertContract]
	@ExternalPlayerID NVARCHAR(100) = NULL,
	@PlayerName NVARCHAR(200) = NULL,
	@YearSigned INT,
	@Years INT,
	@TotalValue DECIMAL(18,2),
	@AverageSalary DECIMAL(18,2),
	@GuaranteedMoney DECIMAL(18,2) = NULL,
	@InflatedValue DECIMAL(18,2) = NULL,
	@InflatedAPY DECIMAL(18,2) = NULL,
	@InflatedGuaranteed DECIMAL(18,2) = NULL,
	@APYCapPercent DECIMAL(5,2) = NULL,
	@IsActive BIT = 1,
	@SourceURL NVARCHAR(500) = NULL
AS
BEGIN
	SET NOCOUNT ON;
	DECLARE @ResolvedPlayerID INT = NULL;

	-- Resolve PlayerID if not provided
	IF @ResolvedPlayerID IS NULL
	BEGIN
		IF @ExternalPlayerID IS NOT NULL
		BEGIN
			SELECT @ResolvedPlayerID = PlayerID 
			FROM [Player].[Players] 
			WHERE ExternalPlayerID = @ExternalPlayerID;
		END
		ELSE IF @PlayerName IS NOT NULL
		BEGIN
			SELECT TOP 1 @ResolvedPlayerID = PlayerID 
			FROM [Player].[Players] 
			WHERE PlayerName = @PlayerName
			ORDER BY CreateDate DESC; -- Get most recent if duplicates
		END
	END

	-- If still not found, return without action or error
	IF @ResolvedPlayerID IS NULL
	BEGIN
		RETURN;
	END

	-- Upsert logic: Check if contract exists by PlayerID + YearSigned
	IF EXISTS (
		SELECT 1 FROM [Player].[Contracts] 
		WHERE PlayerID = @ResolvedPlayerID AND YearSigned = @YearSigned
	)
	BEGIN
		-- Update existing contract
		UPDATE [Player].[Contracts]
		SET 
			Years = @Years,
			TotalValue = @TotalValue,
			AverageSalary = @AverageSalary,
			GuaranteedMoney = @GuaranteedMoney,
			InflatedValue = @InflatedValue,
			InflatedAPY = @InflatedAPY,
			InflatedGuaranteed = @InflatedGuaranteed,
			APYCapPercent = @APYCapPercent,
			IsActive = @IsActive,
			SourceURL = @SourceURL,
			LastModified = SYSDATETIMEOFFSET()
		WHERE PlayerID = @ResolvedPlayerID AND YearSigned = @YearSigned;
	END
	ELSE
	BEGIN
		-- Insert new contract
		INSERT INTO [Player].[Contracts] (
			PlayerID, YearSigned, Years, TotalValue, AverageSalary, GuaranteedMoney,
			InflatedValue, InflatedAPY, InflatedGuaranteed,
			APYCapPercent, IsActive, SourceURL
		)
		VALUES (
			@ResolvedPlayerID, @YearSigned, @Years, @TotalValue, @AverageSalary, @GuaranteedMoney,
			@InflatedValue, @InflatedAPY, @InflatedGuaranteed,
			@APYCapPercent, @IsActive, @SourceURL
		);
	END
END
