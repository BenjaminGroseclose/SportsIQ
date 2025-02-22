

USE main;

-- MLB
-- DROP TABLES IF EXIST
-- DROP TABLE IF EXISTS MLB.TeamStats
-- DROP TABLE IF EXISTS MLB.Batting
-- DROP TABLE IF EXISTS MLB.Pitching
-- DROP TABLE IF EXISTS MLB.Players
-- DROP TABLE IF EXISTS MLB.Teams

CREATE TABLE [MLB].[Teams]
(
    TeamID INT NOT NULL IDENTITY(1,1) PRIMARY KEY,
    City VARCHAR(100) NOT NULL,
    Name VARCHAR(100) NOT NULL,
    Abbreviation VARCHAR(10) NOT NULL,
    IsActive BIT NOT NULL,
    League VARCHAR(2),
    Division VARCHAR(100),
    PrimaryColor VARCHAR(6),
    SecondaryColor VARCHAR(6),
    TertiaryColor VARCHAR(6) NULL,
)

CREATE TABLE [MLB].[Players]
(
    PlayerID INT NOT NULL IDENTITY(1,1) PRIMARY KEY,
    FirstName VARCHAR(100) NOT NULL,
    LastName VARCHAR(100) NOT NULL,
    Jersey INT NULL,
    TeamID INT NULL,
    DateOfBirth DATE NULL,
    PositionCategory VARCHAR(5)  NOT NULL,
    Position VARCHAR(5) NOT NULL,
    BatHand VARCHAR(15) NULL,
    ThrowHand VARCHAR(15) NULL, 
    [Status] VARCHAR(50) NOT NULL,
    ExternalPlayerID INT NULL,

    FOREIGN KEY (TeamID) REFERENCES MLB.Teams(TeamID)
)

CREATE TABLE [MLB].[Batting]
(
    BattingID INT NOT NULL IDENTITY(1,1) PRIMARY KEY,
    PlayerID INT NOT NULL,
    TeamID INT NOT NULL,
    Season INT NOT NULL,
    SeasonType INT NOT NULL,
    Games INT NOT NULL,
    Starts INT NOT NULL,
    AtBats INT NOT NULL,
    Runs INT NOT NULL,
    Hits INT NOT NULL,
    Singles INT NOT NULL,
    Doubles INT NOT NULL,
    Triples INT NOT NULL,
    HomeRuns INT NOT NULL,
    RunsBattedIn INT NOT NULL,
    BattingAverage FLOAT NOT NULL,
    Outs INT NOT NULL,
    Strikeouts INT NOT NULL,
    Walks INT NOT NULL,
    HitByPitch INT NOT NULL,
    Steals INT NOT NULL,
    CaughtStealing INT NOT NULL,
    OBP FLOAT NOT NULL,
    Slug FLOAT NOT NULL,
    [OBPPlus] FLOAT NOT NULL
    
    FOREIGN KEY (PlayerID) REFERENCES MLB.Players(PlayerID),
    FOREIGN KEY (TeamID) REFERENCES MLB.Teams(TeamID)
)

CREATE TABLE [MLB].[Pitching]
(
    PitchingID INT NOT NULL IDENTITY(1,1) PRIMARY KEY,
    PlayerID INT NOT NULL,
    TeamID INT NOT NULL,
    Season INT NOT NULL,
    SeasonType INT NOT NULL,
    Games INT NOT NULL,
    Starts INT NOT NULL,
    Wins INT NOT NULL,
    Losses INT NOT NULL,
    Saves INT NOT NULL,
    InningsPitched FLOAT NOT NULL,
    ERA FLOAT NOT NULL,
    Runs INT NOT NULL,
    Hits INT NOT NULL,
    HomeRuns INT NOT NULL,
    Strikeouts INT NOT NULL,
    StrikeoutsPerNineInnings FLOAT NOT NULL,
    Walks INT NOT NULL,
    WalksPerNineInnings FLOAT NOT NULL,
    PitchesThrown INT NOT NULL,
    WHIP FLOAT NOT NULL,
    BattingAverageAgainst FLOAT NOT NULL,
    OBP FLOAT NOT NULL,
    Slug FLOAT NOT NULL,
    [OBPPlus] FLOAT NOT NULL,
    Shutouts INT NOT NULL

    FOREIGN KEY (PlayerID) REFERENCES MLB.Players(PlayerID),
    FOREIGN KEY (TeamID) REFERENCES MLB.Teams(TeamID)
)

CREATE TABLE [MLB].[TeamStats]
(
    TeamStatID INT NOT NULL IDENTITY(1,1) PRIMARY KEY,
    TeamID INT NOT NULL,
    Season INT NOT NULL,
    SeasonType INT NOT NULL,
    Wins INT NOT NULL,
    Losses INT NOT NULL,
    AtBats INT NOT NULL,
    Runs INT NOT NULL,
    Hits INT NOT NULL,
    Singles INT NOT NULL,
    Doubles INT NOT NULL,
    Triples INT NOT NULL,
    HomeRuns INT NOT NULL,
    BattingAverage FLOAT NOT NULL,
    Outs INT NOT NULL,
    Strikeouts INT NOT NULL,
    Steals INT NOT NULL,
    OBP FLOAT NOT NULL,
    Slug FLOAT NOT NULL,
    [OBPPlus] FLOAT NOT NULL,    
    Saves INT NOT NULL,
    ERA FLOAT NOT NULL,
    PitchingBattingAverage FLOAT NOT NULL,
    PitchingOBP FLOAT NOT NULL,
    PitchingSlug FLOAT NOT NULL,
    [PitchingOBPPlus] FLOAT NOT NULL,

    FOREIGN KEY (TeamID) REFERENCES MLB.Teams(TeamID)
)