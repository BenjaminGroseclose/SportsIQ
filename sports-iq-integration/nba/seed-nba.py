import nba_api.stats.endpoints as nba
import pandas as pd
from nba_api.stats.static import teams

df_players = nba.playerindex.PlayerIndex(season=[2025]).get_dict()
nba_teams = teams.get_teams()

print(df_players)

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

for team in nba_teams:
    team_id = team['id']
    team_code = team['abbreviation']

    roster = nba.commonteamroster.CommonTeamRoster(team_id=team_id).get_data_frames()[0]
    
    payload = pd.DataFrame({
        'Player': df_players[roster['PLAYER_ID']]['PLAYER_FIRST_NAME'],
    })

    print(payload.head())
    
    # clean_height_text = df_players['HEIGHT'].apply(lambda x: None if pd.isna(x) or str(x).strip().lower() in ("", "nan", "none", "null") else str(x))
    # clean_weight = pd.to_numeric(df['WEIGHT'], errors='coerce')
    # clean_jersey = pd.to_numeric(df['JERSEY_NUMBER'], errors='coerce')

    # # Position is currently C, C-F, F, F-G, G, etc. This should be converted to a comma separated list of standard positions
    # # in order to do this we need to replace '-' with ','
    # clean_position = df['POSITION'].apply(lambda x: None if pd.isna(x) or str(x).strip().lower() in ("", "nan", "none", "null") else str(x).replace('-', ','))


    # payload = pd.DataFrame({
    #     'ExternalPlayerID': df['PERSON_ID'],
    #     'FirstName': df['PLAYER_FIRST_NAME'],
    #     'LastName': df['PLAYER_LAST_NAME'],
    #     'SportID': 2, # NBA SportID
    #     'Position': clean_position,
    #     # 'BirthDate': pd.to_datetime(df['BIRTHDATE'], errors='coerce').dt.date,
    #     # If college is null or empty use country
    #     'College': df['COLLEGE'].fillna(df['COUNTRY']).mask(df['COLLEGE'] == '', df['COUNTRY']),
    #     'TeamAbbreviation': df['TEAM_ABBREVIATION'],
    #     'Height': clean_height_text,
    #     'Weight': clean_weight,
    #     'StatusName': df['ROSTER_STATUS'],
    #     'Jersey': clean_jersey,
    #     'FullName': df['PLAYER_FIRST_NAME'] + ' ' + df['PLAYER_LAST_NAME'],
    #     'RookieYear': df['DRAFT_YEAR'],
    # })

# print(payload.head())``