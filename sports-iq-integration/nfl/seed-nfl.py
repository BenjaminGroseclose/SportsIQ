import nflreadpy as nfl
import pandas as pd
import numpy as np
import pyodbc

# Load roster data
df = nfl.load_rosters([2025])

print(df.columns)

# Remove where ExternalPlayerID and BirthDate is null/empty
df = df.filter(~df['gsis_id'].is_null() & ~df['birth_date'].is_null())

# Remove TRC and TRD players
df = df.filter(~df['status'].is_in(['TRC', 'TRD']))

# Convert Polars DataFrame to pandas for compatibility with downstream operations
df = df.to_pandas()

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
    'ExternalPlayerID': df['gsis_id'],
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
    'FullName': df['full_name'],
    'RookieYear': df['rookie_year'],
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

# Get current season ID for 2025
cursor.execute("SELECT SeasonID FROM Core.Seasons WHERE Year = 2025 AND SportID = 5")
season_result = cursor.fetchone()
current_season_id = season_result[0] if season_result else None

# Prepare rows as tuples in TVP order
rows = list(payload.itertuples(index=False, name=None))

# Call stored procedure per row with scalar params matching signature
print(f"Inserting {len(rows)} players...")
for idx, (external_id, first_name, last_name, sport_id, position, birth_date, college, team_abbr, height_txt, weight, status_name, jersey, full_name, rookie_year) in enumerate(rows):

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
            @Jersey = ?,
            @RookieYear = ?;
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
            status_mapped,
            jersey_int,
            rookie_year
        ),
    )
    
    if (idx + 1) % 100 == 0:
        print(f"  Processed {idx + 1}/{len(rows)} players...")

conn.commit()
print(f"Successfully inserted/updated {len(rows)} players!")

# Load contract data from nflreadpy
print("\n--- Seeding Contract Data ---")

nfl_contracts = nfl.load_contracts().to_pandas()

print(nfl_contracts.columns)
# Remove contracts without gsis_id, player, or years
nfl_contracts = nfl_contracts.dropna(subset=['gsis_id', 'player', 'years'])

print(f"Loading {len(nfl_contracts)} contracts...")

for idx, row in nfl_contracts.iterrows():
    # Map nflreadpy contract columns to stored procedure parameters

    cursor.execute(
        """
        EXEC [Player].[UpsertContract]
            @ExternalPlayerID = ?,
            @PlayerName = ?,
            @YearSigned = ?,
            @Years = ?,
            @TotalValue = ?,
            @AverageSalary = ?,
            @GuaranteedMoney = ?,
            @InflatedValue = ?,
            @InflatedAPY = ?,
            @InflatedGuaranteed = ?,
            @IsActive = ?,
            @SourceURL = ?;
        """,
        (
            row['gsis_id'],
            row['player'],
            safe_int(row['year_signed']),
            safe_int(row['years']),
            float(row['value']) if pd.notna(row['value']) else None,
            float(row['apy']) if pd.notna(row['apy']) else None,
            float(row['guaranteed']) if pd.notna(row['guaranteed']) else None,
            float(row['inflated_value']) if pd.notna(row['inflated_value']) else None,
            float(row['inflated_apy']) if pd.notna(row['inflated_apy']) else None,
            float(row['inflated_guaranteed']) if pd.notna(row['inflated_guaranteed']) else None,
            int(row['is_active']) if pd.notna(row['is_active']) else None,
            row['player_page']
        )
    )
    
    if (idx + 1) % 1000 == 0:
        print(f"  Processed {idx + 1}/{len(nfl_contracts)} contracts...")

conn.commit()
print(f"Successfully inserted/updated {len(nfl_contracts)} contracts!")

# Seed Player Rankings 
# TODO: pull from external source or calculate based on performance metrics
print("\n--- Seeding Player Rankings ---")

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