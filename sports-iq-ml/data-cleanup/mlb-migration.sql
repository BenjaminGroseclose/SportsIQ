
DROP TABLE IF EXISTS #MainPlayerIDs
DROP TABLE IF EXISTS #TeamMap
DROP TABLE IF EXISTS #ExistPlayers

--SELECT * FROM People WHERE nameLast = 'Semien' AND nameFirst = 'Marcus'

--SELECT * FROM Batting WHERE playerID = 'semiema01' and yearID = 2023

CREATE TABLE #TeamMap
(
	TeamID INT NOT NULL
	,ExternalFranchID VARCHAR(3) NOT NULL
)

CREATE TABLE #ExistPlayers 
(
    PlayerID INT NOT NULL,
    TeamID INT NOT NULL,
    Season INT NOT NULL,
    SeasonType INT NOT NULL,
    Games INT NOT NULL,
    AtBats INT NOT NULL,
    Runs INT NOT NULL,
    Hits INT NOT NULL,
    Doubles INT NOT NULL,
    Triples INT NOT NULL,
    HomeRuns INT NOT NULL,
    RunsBattedIn INT NOT NULL,
    BattingAverage FLOAT NOT NULL,
    Strikeouts INT NOT NULL,
    Walks INT NOT NULL,
    HitByPitch INT NOT NULL,
    Steals INT NOT NULL,
    CaughtStealing INT NOT NULL,
    OBP FLOAT NOT NULL,
    Slug FLOAT NOT NULL,
    [OBPPlus] FLOAT NOT NULL
)

INSERT INTO #TeamMap (TeamID, ExternalFranchID)
VALUES 
(1, 'LAD'),
(2, 'CIN'),
(3, 'TOR'),
(4, 'PIT'),
(5, 'KCR'),
(6, 'CHC'),
(7, 'CLE'),
(8, 'TBD'),
(9, 'PHI'),
(10, 'SEA'),
(11, 'ARI'),
(12, 'SFG'),
(13, 'CHW'),
(14, 'DET'),
(15, 'NYM'),
(16, 'BAL'),
(17, 'MIN'),
(18, 'ANA'),
(19, 'FLA'),
(20, 'COL'),
(21, 'OAK'),
(22, 'BOS'),
(23, 'ATL'),
(24, 'TEX'),
(25, 'NYY'),
(26, 'HOU'),
(27, 'STL'),
(28, 'MIL'),
(29, 'SDP'),
(30, 'WSN')

--SELECT * FROM #TeamMap

CREATE TABLE #MainPlayerIDs
(
	ID INT NULL
	,ExternalPlayerID VARCHAR(100) NOT NULL,
)

INSERT INTO #MainPlayerIDs
(
	ID
	,ExternalPlayerID
)
SELECT
	pmlb.PlayerID
	,p.playerID
FROM 
	dbo.People p 
	JOIN dbo.Batting b 
		ON b.playerID = p.playerID
		AND b.yearID >= 1990
	LEFT JOIN dbo.PlayerMLB pmlb ON
		pmlb.LastName = p.nameLast
		AND pmlb.FirstName = p.nameFirst
		--AND pmlb.DateOfBirth = (p.birthYear + '-' + p.birthMonth + '-' + p.birthDay)
GROUP BY
	pmlb.PlayerID
	,p.playerID

-- 2425
--SELECT COUNT(*) FROM #MainPlayerIDs WHERE ID IS NULL 
--SELECT COUNT(*) FROM #MainPlayerIDs WHERE ID IS NOT NULL 
--SELECT * FROM #MainPlayerIDs

-- Batting
--INSERT INTO #ExistPlayers
SELECT
	mpi.ID AS [PlayerID]
	--,tm.TeamID AS [TeamID]
	,b.yearID AS [Season]
	,1 AS [SeasonType] -- Regular Season
	,b.G AS [Games]
	,b.AB AS [AtBats]
	,b.R AS [Runs]
	,b.H AS [Hits]
	,b.[2B] AS [Doubles]
	,b.[3B] AS [Triples]
	,b.HR AS [HomeRuns]
	,b.RBI AS [RunsBattedIn]
	,CASE WHEN (b.AB = 0) THEN 0 ELSE ROUND(b.H * 1.0 / b.AB, 3) END AS [BattingAverage]
	,b.SO AS [Strikeouts]
	,b.BB AS [Walks]
	,b.HBP AS [HitByPitch]
	,b.SB AS [Steals]
	,b.CS AS [CaughtStealing]
	--  (Hits + Walks + Hit by Pitch) / (At Bats + Walks + Hit by Pitch + Sacrifice Flies)
	,CASE 
		WHEN (b.AB = 0) THEN 0 
		ELSE 
			ROUND((b.H + b.BB + b.HBP) * 1.0 / (b.AB + b.BB + b.HBP + b.SF), 3)
	END AS [OBP]
	, CASE 
		WHEN (b.AB = 0) THEN 0 
		ELSE 
			ROUND(( b.H + b.[2B] +2*b.[3B] + 3*b.HR) * 1.0 / b.AB, 3)
	END AS [Slug]
	,CASE 
		WHEN (b.AB = 0) THEN 0 
		ELSE 
			ROUND(((b.H + b.BB + b.HBP) * 1.0 / (b.AB + b.BB + b.HBP + b.SF)) + (( b.H + b.[2B] +2*b.[3B] + 3*b.HR) * 1.0 / b.AB), 3)
	END AS [OBPPlus]
	,mpi.ExternalPlayerID
FROM 
	#MainPlayerIDs mpi
	JOIN PlayerMLB pmlb ON mpi.ID = pmlb.PlayerID
	JOIN Batting  b ON b.playerID = mpi.ExternalPlayerID
	JOIN Teams t ON t.teamID = b.teamID AND t.yearID = b.yearID
	JOIN #TeamMap tm ON tm.ExternalFranchID = t.franchID

SELECT * FROM #ExistPlayers