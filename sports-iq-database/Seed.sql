-- This file contains SQL statements that will be executed after the build script.
DELETE FROM [SportsIQ].[Core].[Teams];
DELETE FROM [SportsIQ].[Core].[Seasons];
DELETE FROM [SportsIQ].[Core].[Sports];

INSERT INTO [SportsIQ].[Core].[Sports] ([SportName], [Abbreviation], [CreateDate])
VALUES
    ('Soccer', 'MLS', SYSDATETIMEOFFSET()),
    ('Basketball', 'NBA', SYSDATETIMEOFFSET()),
    ('Baseball', 'MLB', SYSDATETIMEOFFSET()),
    ('Hockey', 'NHL', SYSDATETIMEOFFSET()),
    ('Football', 'NFL', SYSDATETIMEOFFSET()),
    ('College Football', 'NCAAF', SYSDATETIMEOFFSET()),
    ('College Basketball', 'NCAAMB', SYSDATETIMEOFFSET());

-- Seed data for Player.PlayerStatus
INSERT INTO [SportsIQ].[Player].[PlayerStatuses] ([Name], [Description], [InjuredListEligible]) 
VALUES
    ('Active', 'Player is currently active and eligible to play.', 0),
	('Pratice Squad', 'Player is on the practice squad and not eligible to play.', 0),
	('Reserve', 'Player is on reserve list and not eligible to play.', 0),
    ('Retired', 'Player has retired from professional play.', 0),
	('Cut', 'Player has been cut from the team and is a free agent.', 0),
    ('Inactive', 'Player is not currently active for other reasons.', 0),
    ('Suspended', 'Player is suspended due to disciplinary reasons.', 0),
	('Physically Unable to Perform', 'Player is on PUP list and not eligible to play.', 1),
	('Unknown', 'Player status is unknown.', 0);

-- Seed data for NFL Positions (SportID = 5)
INSERT INTO [SportsIQ].[Core].[Positions] ([SportID], [PositionName], [DisplayOrder], [IsFantasyRelevant])
VALUES
    -- Offense
    (5, 'QB', 1, 1),
    (5, 'RB', 2, 1),
    (5, 'FB', 3, 0),
    (5, 'WR', 4, 1),
    (5, 'TE', 5, 1),
    (5, 'OT', 6, 0),
    (5, 'OG', 7, 0),
    (5, 'C', 8, 0),
    (5, 'OL', 9, 0),
    -- Defense
    (5, 'DE', 10, 0),
    (5, 'DT', 11, 0),
    (5, 'NT', 12, 0),
    (5, 'DL', 13, 0),
    (5, 'LB', 14, 0),
    (5, 'ILB', 15, 0),
    (5, 'OLB', 16, 0),
    (5, 'MLB', 17, 0),
    (5, 'CB', 18, 0),
    (5, 'S', 19, 0),
    (5, 'FS', 20, 0),
    (5, 'SS', 21, 0),
    (5, 'DB', 22, 0),
    -- Special Teams
    (5, 'K', 23, 1),
    (5, 'P', 24, 0),
    (5, 'LS', 25, 0);

INSERT INTO [SportsIQ].[Core].[Seasons] ([Year], SportID, IsCurrent)
VALUES
    (2023, 5, 0),
    (2024, 5, 0),
    (2025, 5, 1);


INSERT INTO [SportsIQ].[Core].[Teams] ([City], [Name], [SportID], [Abbreviation], [PrimaryColor], [SecondaryColor], [Logo])
VALUES
    ('Arizona', 'Cardinals', 5, 'ARI', '#97233F', '#000000', 'https://a.espncdn.com/i/teamlogos/nfl/500-dark/scoreboard/ari.png'),
    ('Atlanta', 'Falcons', 5, 'ATL', '#a71930', '#000000', 'https://a.espncdn.com/i/teamlogos/nfl/500-dark/scoreboard/atl.png'),
    ('Baltimore', 'Ravens', 5, 'BAL', '#241773', '#000000', 'https://a.espncdn.com/i/teamlogos/nfl/500-dark/scoreboard/bal.png'),
    ('Buffalo', 'Bills', 5, 'BUF', '#00338D', '#C60C30', 'https://a.espncdn.com/i/teamlogos/nfl/500-dark/scoreboard/buf.png'),
    ('Carolina', 'Panthers', 5, 'CAR', '#0085CA', '#101820', 'https://a.espncdn.com/i/teamlogos/nfl/500-dark/scoreboard/car.png'),
    ('Chicago', 'Bears', 5, 'CHI', '#0B162A', '#c83803', 'https://a.espncdn.com/i/teamlogos/nfl/500-dark/scoreboard/chi.png'),
    ('Cincinnati', 'Bengals', 5, 'CIN', '#fb4f14', '#000000', 'https://a.espncdn.com/i/teamlogos/nfl/500-dark/scoreboard/cin.png'),
    ('Cleveland', 'Browns', 5, 'CLE', '#311D00', '#ff3c00', 'https://a.espncdn.com/i/teamlogos/nfl/500-dark/scoreboard/cle.png'),
    ('Dallas', 'Cowboys', 5, 'DAL', '#003594', '#041E42', 'https://a.espncdn.com/i/teamlogos/nfl/500-dark/scoreboard/dal.png'),
    ('Denver', 'Broncos', 5, 'DEN', '#FB4F14', '#002244', 'https://a.espncdn.com/i/teamlogos/nfl/500-dark/scoreboard/den.png'),
    ('Detroit', 'Lions', 5, 'DET', '#0076b6', '#B0B7BC', 'https://a.espncdn.com/i/teamlogos/nfl/500-dark/scoreboard/det.png'),
    ('Green Bay', 'Packers', 5, 'GB', '#203731', '#FFB612', 'https://a.espncdn.com/i/teamlogos/nfl/500-dark/scoreboard/gb.png'),
    ('Houston', 'Texans', 5, 'HOU', '#03202f', '#A71930', 'https://a.espncdn.com/i/teamlogos/nfl/500-dark/scoreboard/hou.png'),
    ('Indianapolis', 'Colts', 5, 'IND', '#101820', '#A2AAAD', 'https://a.espncdn.com/i/teamlogos/nfl/500-dark/scoreboard/ind.png'),
    ('Jacksonville', 'Jaguars', 5, 'JAC', '#006778', '#D7A22A', 'https://a.espncdn.com/i/teamlogos/nfl/500-dark/scoreboard/jax.png'),
    ('Kansas City', 'Chiefs', 5, 'KC', '#E31837', '#FFB81C', 'https://a.espncdn.com/i/teamlogos/nfl/500-dark/scoreboard/kc.png'),
    ('Las Vegas', 'Raiders', 5, 'LV', '#A5ACAF', '#000000', 'https://a.espncdn.com/i/teamlogos/nfl/500-dark/scoreboard/lv.png'),
    ('Los Angeles', 'Chargers', 5, 'LAC', '#0080C6', '#FFC20E', 'https://a.espncdn.com/i/teamlogos/nfl/500-dark/scoreboard/lac.png'),
    ('Los Angeles', 'Rams', 5, 'LAR', '#003594', '#ffa300', 'https://a.espncdn.com/i/teamlogos/nfl/500-dark/scoreboard/lar.png'),
    ('Miami', 'Dolphins', 5, 'MIA', '#008E97', '#FC4C02', 'https://a.espncdn.com/i/teamlogos/nfl/500-dark/scoreboard/mia.png'),
    ('Minnesota', 'Vikings', 5, 'MIN', '#4F2683', '#FFC62F', 'https://a.espncdn.com/i/teamlogos/nfl/500-dark/scoreboard/min.png'),
    ('New England', 'Patriots', 5, 'NE', '#002244', '#C60C30', 'https://a.espncdn.com/i/teamlogos/nfl/500-dark/scoreboard/ne.png'),
    ('New Orleans', 'Saints', 5, 'NO', '#D3BC8D', '#101820', 'https://a.espncdn.com/i/teamlogos/nfl/500-dark/scoreboard/no.png'),
    ('New York', 'Giants', 5, 'NYG', '#0B2265', '#a71930', 'https://a.espncdn.com/i/teamlogos/nfl/500-dark/scoreboard/nyg.png'),
    ('New York', 'Jets', 5, 'NYJ', '#125740', '#000000', 'https://a.espncdn.com/i/teamlogos/nfl/500-dark/scoreboard/nyj.png'),
    ('Philadelphia', 'Eagles', 5, 'PHI', '#004C54', '#A5ACAF', 'https://a.espncdn.com/i/teamlogos/nfl/500-dark/scoreboard/phi.png'),
    ('Pittsburgh', 'Steelers', 5, 'PIT', '#FFB612', '#101820', 'https://a.espncdn.com/i/teamlogos/nfl/500-dark/scoreboard/pit.png'),
    ('San Francisco', '49ers', 5, 'SF', '#AA0000', '#B3995D', 'https://a.espncdn.com/i/teamlogos/nfl/500-dark/scoreboard/sf.png'),
    ('Seattle', 'Seahawks', 5, 'SEA', '#002244', '#69BE28', 'https://a.espncdn.com/i/teamlogos/nfl/500-dark/scoreboard/sea.png'),
    ('Tampa Bay', 'Buccaneers', 5, 'TB', '#D50A0A', '#FF7900', 'https://a.espncdn.com/i/teamlogos/nfl/500-dark/scoreboard/tb.png'),
    ('Tennessee', 'Titans', 5, 'TEN', '#0C2340', '#4B92DB', 'https://a.espncdn.com/i/teamlogos/nfl/500-dark/scoreboard/ten.png'),
    ('Washington', 'Commanders', 5, 'WAS', '#5A1414', '#FFB612', 'https://a.espncdn.com/i/teamlogos/nfl/500-dark/scoreboard/wsh.png')




-- Indexes

CREATE INDEX [IX_Contracts_PlayerID] ON [Player].[Contracts] ([PlayerID]);
CREATE INDEX [IX_Contracts_YearSigned] ON [Player].[Contracts] ([YearSigned]);
CREATE INDEX [IX_Contracts_IsActive] ON [Player].[Contracts] ([IsActive]);
