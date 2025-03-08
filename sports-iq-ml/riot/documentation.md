# League of Legends - Best Pick

Goal: Collect a large set of league of legend matches and anaylze them to help players select the best champion available to help with win the game. 

Question Format: In the situation where all but 1 champion is selected, what champion can a player pick that gives him the best change of winning the game. 

## Journal

### 3/6/24

Gather data from [Riot API](https://developer.riotgames.com/) and start to investigate how I am going to use it. 

- Initial thought was to collect all games on the most recent patch. 
	- After investigation this does not appear to be possible as their matches API data is limited to only getting matches by
		- PUUID (Player UUID)
		- Match ID

- An alternative option would be to collect of matches by players that are "challenger" (top 300) they have an endpoint that will give me all current challenger players
	- [/lol/league/v4/challengerleagues/by-queue/{queue}](https://developer.riotgames.com/apis#league-v4/GET_getChallengerLeague)

```py
def getChallengers() -> pd.DataFrame:
	url = f"{base_url}/lol/league/v4/challengerleagues/by-queue/{solo_duo}?api_key={api_key}"

	response = requests.get(url)

	if response.status_code == 200:
			data = response.json()
			players = data['entries']

			return pd.DataFrame(players)
```

- Once we have the 300 challenger we can get their most recent matches with another RIOT API endpoint
	-  [/lol/match/v5/matches/by-puuid/{puuid}/ids](https://developer.riotgames.com/apis#match-v5/GET_getMatchIdsByPUUID)
		- this has a query parameter of the number of ids to return, initially thinking just 20 per challenger which will result in 6000 matches
		- Realizing that many of this matches will overlap so I should remove duplicates before looping, will be interesting to know how many duplicates there are.
	- This will get us their `matchId` which we can then loop through and get match data with
		- [/lol/match/v5/matches/{matchId}](https://developer.riotgames.com/apis#match-v5/GET_getMatch)
	- Need to be mindful that I am limited to 20 API requests a second and 100 per 2 mins with Riot's API
		- Solution is to chunk the data and only retrieve some a certain time

- After collecting all the match data we will then need to do some data pre-processing
	- encoding
	- MinMaxScaling
	- etc

- Created a `MatchIDs.csv` file that contains 6000 matchIDs (I have not removed duplicates yet) the 6000 come from the top 300 players (challenger level) last 20 games. Meaning we have the top player's last 20 games, the second to top player's last 20 games... etc
	- Removed Duplicates and it went from `6000 -> 3078` matches
	- Question is, is this enough data?

```py
match_ids = pd.read_csv("MatchIDs.csv")
match_ids = match_ids.drop("Unnamed: 0", axis=1)

match_ids = match_ids.drop_duplicates()
```


### 3/7/24

- Setup the `getMatchData` method to scrub the data to the format we are interested in initially

```py
blueTeamId = 100
redTeamId = 200
def getWinner(teams):
	for t in teams:
		if t['teamId'] == blueTeamId:
			return 0 if t['win'] else 1

def getChampionID(participants, side, position):
	for p in participants:
		if p['teamId'] == side and p['teamPosition'] == position:
			return p['championId']


def getMatchData(matchId):
	url = f"https://americas.api.riotgames.com/lol/match/v5/matches/{matchId}?api_key={api_key}"

	response = requests.get(url)

	if response.status_code == 200:
		match_data = response.json()

		scrubbed_match_data = {
			'matchId': match_data['metadata']['matchId'],
			'gameDurationSeconds': match_data['info']['gameDuration'],
			'championBlueTop': getChampionID(match_data['info']['participants'], blueTeamId, 'TOP'),
			'championBlueJG': getChampionID(match_data['info']['participants'], blueTeamId, 'JUNGLE'),
			'championBlueMid': getChampionID(match_data['info']['participants'], blueTeamId, 'MIDDLE'),
			'championBlueBot': getChampionID(match_data['info']['participants'], blueTeamId, 'BOTTOM'),
			'championBlueSup': getChampionID(match_data['info']['participants'], blueTeamId, 'UTILITY'),
			'championRedTop': getChampionID(match_data['info']['participants'], redTeamId, 'TOP'),
			'championRedJG': getChampionID(match_data['info']['participants'], redTeamId, 'JUNGLE'),
			'championRedMid': getChampionID(match_data['info']['participants'], redTeamId, 'MIDDLE'),
			'championRedBot': getChampionID(match_data['info']['participants'], redTeamId, 'BOTTOM'),
			'championRedSup': getChampionID(match_data['info']['participants'], redTeamId, 'UTILITY'),
			'winner': getWinner(match_data['info']['teams']) # 0 = Blue side, 1 = Red Side
		}

		return scrubbed_match_data
```