import nfl_data_py as nfl
import pandas as pd
import pyodbc

# Load roster data
df = nfl.import_seasonal_rosters([2025])

# Map/rename columns to TVP schema
payload = pd.DataFrame({
    'ExternalPlayerID': df['player_id'].astype('Int64'),  # ensure int
    'FirstName': df['first_name'],
    'LastName': df['last_name'],
    'SportID': 1,  # e.g., NFL = 1
    'Position': df['position'],
    'BirthDate': pd.to_datetime(df['birth_date'], errors='coerce').dt.date,
    'College': df['college'],
    'TeamAbbreviation': df['team'],
    'Height': df['height'],
    'Weight': pd.to_numeric(df['weight'], errors='coerce'),
    'StatusName': df['status'],   # map from roster status; adjust as needed
    'Jersey': pd.to_numeric(df['jersey_number'], errors='coerce'),
})

# Replace NaN with None for pyodbc
payload = payload.where(pd.notnull(payload), None)

conn = pyodbc.connect(
    "DRIVER={ODBC Driver 18 for SQL Server};SERVER=localhost;DATABASE=SportsIQ;UID=sa;PWD=P@ssw0rd123;TrustServerCertificate=Yes"
)
cursor = conn.cursor()
cursor.fast_executemany = True

# Prepare rows as tuples in TVP order
rows = list(payload.itertuples(index=False, name=None))

# Create a temporary table and insert rows, then call the proc
cursor.execute("""
DECLARE @tvp Player.PlayerUpsertType;
""")
# Insert rows into @tvp
for row in rows:
    cursor.execute("""
    INSERT INTO @tvp (ExternalPlayerID, FirstName, LastName, SportID, Position, BirthDate, College, TeamAbbreviation, Height, Weight, StatusName, Jersey)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, row)

# Execute MERGE via stored procedure
cursor.execute("EXEC Player.UpsertPlayer @Players = @tvp;")
conn.commit()

base_elo = 1000
increment = 12  # Each rank higher gets +12 ELO

df = pd.read_csv('nfl_ranking.csv')
for index, row in df.iterrows():
    player_elo = base_elo + (299 - row['Rank']) * increment
    print(f"Setting {row['Player']} ELO to {player_elo}")

    # TODO: Add Year later
    cursor.execute(
        """
								DECLARE @PlayerID INT; SET @PlayerID = (SELECT TOP 1 PlayerID FROM [Player].[Players] WHERE [FirstName] + ' ' + [LastName] = ?);
								DECLARE @PlayerELO INT = ?;
								INSERT INTO [Ranking].[Rankings] ([PlayerID], [Rating], [Year])
								VALUES (@PlayerID, @PlayerELO, 2025);
								""",
        (row['Player'], player_elo)
    )

cursor.close()
conn.close()