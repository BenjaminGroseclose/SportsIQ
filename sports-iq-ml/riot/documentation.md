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

- After collecting all the match data we will then need to do some data pre-processing
	- encoding
	- MinMaxScaling
	- etc