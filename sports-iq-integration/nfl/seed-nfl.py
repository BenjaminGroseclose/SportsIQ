import nflreadpy as nfl
import pandas as pd
import numpy as np
import pyodbc

# Load roster data
df = nfl.load_rosters([2025])

# Remove where ExternalPlayerID is null/empty
df = df[df['player_id'].notnull() & (df['player_id'] != '')]
df = df[df['birth_date'].notnull() & (df['birth_date'] != '')]

# Remove TRC and TRD players
df = df[~df['status'].isin(['TRC', 'TRD'])]

def status_mapping(status):
    status_map = {
        'ACT': 'Active',
        'DEV': 'Practice Squad',
        'RES': 'Reserve',
        'RET': 'Retired',
        'CUT': 'Cut',
        'INA': 'Inactive',
        'SUS': 'Suspended',
        'PUP': 'Physically Unable to Perform',
    }
    return status_map.get(status, 'Unknown')

# Map/rename columns to TVP schema
def parse_height_to_inches(val):
    # Accept formats like "6-2" or "6'2\"" or numeric inches; return float inches
    if val is None:
        return None
    try:
        # Normalize string
        s = str(val).strip().lower()
        if s in ("", "nan", "none", "null"):
            return None
        # Formats like 6-2 or 6'2"
        if "-" in s:
            parts = s.split("-")
        elif "'" in s:
            parts = s.replace("\"", "").split("'")
        else:
            # Try numeric inches
            return float(s)
        if len(parts) >= 2:
            feet = int(parts[0])
            inches = int(parts[1])
            return float(feet * 12 + inches)
        return None
    except Exception:
        return None

def safe_int(val):
    try:
        if val is None:
            return None
        s = str(val).strip()
        if s == "" or s.lower() in ("nan", "none", "null"):
            return None
        return int(float(s))
    except Exception:
        return None

# Clean/sanitize fields before building payload
# Height: keep as original text NVARCHAR as proc expects NVARCHAR(50)
clean_height_text = df['height'].apply(lambda x: None if pd.isna(x) or str(x).strip().lower() in ("", "nan", "none", "null") else str(x))
clean_weight = pd.to_numeric(df['weight'], errors='coerce')
clean_jersey = pd.to_numeric(df['jersey_number'], errors='coerce')

payload = pd.DataFrame({
    'ExternalPlayerID': df['player_id'],
    'FirstName': df['first_name'],
    'LastName': df['last_name'],
    'SportID': 5, # NFL SportID
    'Position': df['position'],
    'BirthDate': pd.to_datetime(df['birth_date'], errors='coerce').dt.date,
    'College': df['college'],
    'TeamAbbreviation': df['team'],
    'Height': clean_height_text,
    'Weight': clean_weight,
    'StatusName': df['status'],
    'Jersey': clean_jersey,
    'FullName': df['player_name']
})

# Replace NaN (numpy/pandas) with None for pyodbc
payload = payload.replace({pd.NA: None, np.nan: None})

# Ensure types in DataFrame are Python-native where possible
payload['Height'] = payload['Height'].apply(lambda x: float(x) if x is not None else None)
payload['Weight'] = payload['Weight'].apply(lambda x: float(x) if x is not None else None)
payload['Jersey'] = payload['Jersey'].apply(lambda x: int(x) if x is not None else None)

conn = pyodbc.connect(
    "DRIVER={ODBC Driver 17 for SQL Server};SERVER=localhost;DATABASE=SportsIQ;UID=sa;PWD=P@ssw0rd123;TrustServerCertificate=Yes"
)
cursor = conn.cursor()
cursor.fast_executemany = True

# Prepare rows as tuples in TVP order
rows = list(payload.itertuples(index=False, name=None))

# Call stored procedure per row with scalar params matching signature
for (external_id, first_name, last_name, sport_id, position, birth_date, college, team_abbr, height_txt, weight, status_name, jersey, full_name) in rows:

    # Ensure INTs
    weight_int = safe_int(weight)
    jersey_int = safe_int(jersey)
    status_mapped = status_mapping(status_name)

    cursor.execute(
        """
        EXEC [Player].[UpsertPlayer]
            @FirstName = ?,
            @LastName = ?,
            @PlayerName = ?,
            @SportID = ?,
            @Position = ?,
            @BirthDate = ?,
            @College = ?,
            @Team = ?,
            @Height = ?,
            @Weight = ?,
            @ExternalPlayerID = ?,
            @Status = ?,
            @Jersey = ?;
        """,
        (
            first_name,
            last_name,
            full_name,
            sport_id,
            position,
            birth_date,
            college,
            team_abbr,
            height_txt,
            weight_int,
            external_id,
            status_name,
            jersey_int,
        ),
    )
conn.commit()

base_elo = 1000
increment = 12  # Each rank higher gets +12 ELO

df = pd.read_csv('nfl_ranking.csv')
for index, row in df.iterrows():
    player_elo = base_elo + (299 - row['Rank']) * increment

    # TODO: Add Year later
    cursor.execute(
        """
        DECLARE @PlayerID INT; SET @PlayerID = (SELECT TOP 1 PlayerID FROM [Player].[Players] WHERE [PlayerName] = ?);
        DECLARE @PlayerELO INT = ?;
        INSERT INTO [Ranking].[PlayerRankings] ([PlayerID], [Rating])
        VALUES (@PlayerID, @PlayerELO);
        """,
        (row['Player'], player_elo)
    )

conn.commit()

cursor.close()
conn.close()