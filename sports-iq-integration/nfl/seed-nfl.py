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

    try:
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
                height_txt,
                weight_int,
                external_id,
                status_mapped,
                jersey_int,
                rookie_year
            ),
        )
    except Exception as e:
        print(f"Error inserting player row {idx}: {rows[idx]}")
        print(f"Error: {e}")
    
    if (idx + 1) % 100 == 0:
        print(f"  Processed {idx + 1}/{len(rows)} players...")

conn.commit()
print(f"Successfully inserted/updated {len(rows)} players!")

# Load contract data from nflreadpy
print("\n--- Seeding Contract Data ---")

nfl_contracts = nfl.load_contracts().to_pandas()

# Remove contracts without gsis_id, player, or years
nfl_contracts = nfl_contracts.dropna(subset=['gsis_id', 'player', 'years'])

print(f"Loading {len(nfl_contracts)} contracts...")

# TODO: After initial insert only need to concern with new/updated contracts

# Order by player then by year_signed desc 2025 to oldest
nfl_contracts = nfl_contracts.sort_values(by=['player', 'year_signed'], ascending=[True, False])
for idx, row in nfl_contracts.iterrows():
    # Map nflreadpy contract columns to stored procedure parameters

    cols_data = row['cols']

    if (cols_data is None):
        print(f"  Warning: Contract 'cols' data is invalid for player {row['player']} with ExternalPlayerID {row['gsis_id']}. Skipping.")
        continue

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
            int(row['is_active']) if pd.notna(row['is_active']) else None,
            row['player_page']
        )
    )
    
    # Fetch result from stored procedure (ContractID)
    result = cursor.fetchone()
    contract_id = result[0] if result else None

    if (contract_id is None):
        print(f"  Warning: Could not upsert contract for player {row['player']} with ExternalPlayerID {row['gsis_id']}. Skipping contract years insertion.")
        continue

    cursor.execute(
        """
        DELETE FROM [Player].[ContractYears]
        WHERE ContractID = ?;
        """,
        (contract_id,)
    )

    # Insert Contract Years

    # TODO: Bug: I am not handling extension well and I am associating some years to two different contracts

    # Remove "Total" year from cols_data if present
    cols_data = [col for col in cols_data if not (isinstance(col, dict) and col.get('year', '').lower() == 'total')]

    year_signed = safe_int(row['year_signed'])
    years = safe_int(row['years'])

    # Remove years this contract is not responsible for (beyond Years length)
    cols_data = [col for col in cols_data if safe_int(col.get('year')) is not None and safe_int(col.get('year')) >= year_signed and safe_int(col.get('year')) < year_signed + years]

    for contract_years in cols_data:
        team = contract_years.get('team')
        year = safe_int(contract_years.get('year'))
        base_salary = float(contract_years.get('base_salary')) if contract_years.get('base_salary') is not None else None
        prorated_bonus = float(contract_years.get('prorated_bonus')) if contract_years.get('prorated_bonus') is not None else None
        roster_bonus = float(contract_years.get('roster_bonus')) if contract_years.get('roster_bonus') is not None else None
        guaranteed_salary = float(contract_years.get('guaranteed_salary')) if contract_years.get('guaranteed_salary') is not None else None
        cap_number = float(contract_years.get('cap_number')) if contract_years.get('cap_number') is not None else None
        cash_paid = float(contract_years.get('cash_paid')) if contract_years.get('cash_paid') is not None else None
        cap_percent = float(contract_years.get('cap_percent')) if contract_years.get('cap_percent') is not None else None

        # The Redskins -> Washington Commanders mapping could be handled here if needed
        if team == 'Redskins':
            team = 'Washington'

        try:
            cursor.execute(
                """
                DECLARE @TeamID INT;

                SELECT TOP 1 @TeamID = TeamID FROM Core.Teams WHERE (Name = ? OR City = ?) AND SportID = 5;

                INSERT INTO [Player].[ContractYears]
                (ContractID, Year, TeamID, BaseSalary, CapNumber, CapPercent, GuaranteedMoney, ProratedSigningBonus, RosterBonus, CashPaid)
                VALUES (?, ?, @TeamID, ?, ?, ?, ?, ?, ?, ?);
                """,
                (
                    team,
                    team,
                    contract_id,
                    year,
                    base_salary,
                    cap_number,
                    cap_percent,
                    guaranteed_salary,
                    prorated_bonus,
                    roster_bonus,
                    cash_paid,
                )
            )
        except Exception as e:
            print(f"Error inserting contract year for player {row['player']} year {year}: {contract_years}")
            print(f"Error: {e}")
            raise e

    
    if (idx + 1) % 1000 == 0:
        print(f"  Processed {idx + 1}/{len(nfl_contracts)} contracts...")

conn.commit()
print(f"Successfully inserted/updated {len(nfl_contracts)} contracts!")

cursor.close()
conn.close()