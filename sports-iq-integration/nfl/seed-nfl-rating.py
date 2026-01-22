import pandas as pd
import numpy as np
import pyodbc

# TODO: Possible need to adjust these scores weekly and will want to track a history

print("\n--- Seeding SportsID Data ---")

conn = pyodbc.connect(
    "DRIVER={ODBC Driver 17 for SQL Server};SERVER=localhost;DATABASE=SportsIQ;UID=sa;PWD=P@ssw0rd123;TrustServerCertificate=Yes"
)
cursor = conn.cursor()
cursor.fast_executemany = True

seasons = [2023, 2024, 2025]
positions = ['qb', 'rb', 'wr', 'te', 'dl', 'lb', 'db']

for season in seasons:
    for position in positions:
        print(f"Seeding SportsID for {season} {position.upper()} players...")

        df_players = pd.read_csv(f'nfl_p_{position}_sportsiq_{season}.csv')

        for index, row in df_players.iterrows():
            try:
                cursor.execute(
                    """
                    EXEC [Player].[UpsertPlayerRating]
                        @ExternalPlayerID = ?,
                        @Season = ?,
                        @SportsIQRating = ?,
                        @RawScore = ?,
                        @ConfidenceScore = ?,
                    """,
                    (
                        row['gsis_id'],
                        season,
                        row['SportsIQRating'],
                        row['RawScore'],
                        row['ConfidenceScore']
                    )
                )
            except Exception as e:
                print(f"Error upserting player {row['gsis_id']} for {season} {position.upper()}: {e}")
                print(f"Row data: {row.to_dict()}")
                raise e
        

conn.commit()
cursor.close()
conn.close()

print("\n--- Completed Seeding SportsID Data ---")