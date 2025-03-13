# League of Legends - Best Pick

Goal: Collect a large set of league of legend matches and anaylze them to help players select the best champion available to help with win the game. 

Question Format: In the situation where all but 1 champion is selected, what champion can a player pick that gives him the best change of winning the game. 

## Journal

### 3/6/25

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


### 3/7/25

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


### 3/8/25

- I believe I need to get more data, so going to pull Challenger, Grand Master and Master games

### 3/10/25

- Updated to fetch Challenger, Grand Master and Master games and to get their last 40 games

```py
def getLadder(type) -> pd.DataFrame:
	url = f"{base_url}/lol/league/v4/{type}/by-queue/{solo_duo}?api_key={api_key}"

	response = requests.get(url)

	print(response)

	if response.status_code == 200:
			data = response.json()
			players = data['entries']

			return pd.DataFrame(players)

def getMatches(puuid):
	url = f"https://americas.api.riotgames.com/lol/match/v5/matches/by-puuid/{puuid}/ids?queue=420&start=0&count=40&api_key={api_key}"

	response = requests.get(url)

	if response.status_code == 200:
			data = response.json()

			return data
	else:
		print(response)

def getAllLadders():
	ladder = pd.concat([getLadder("challengerleagues"), getLadder("grandmasterleagues"), getLadder("masterleagues")])

	return ladder
```

- That result in getting `236908` matchIds that we can use, the script too a very long time due the RIOT api restrictions (100 requets per 2 mins)

- Removing duplicate matchIds since many of these players play against each other results in `81542` matches

`236908 -> 81542`

- Now I am going to write a script that will fetch the 81542 matches. This is going to take a while due to the 100 request per 2 mins limitions. This is going to take about 27 hours to complete. 
	- `81542 / 100 = 815.42 * 2 = 1630.84 / 60 = 27.18`
	- I will attempt to batch it so that I can start working on some data while the remaining matches are loaded. 

```
def getMatches(match_ids):
	allMatches = []
	matchIdProcessed = []
	try:

		for index, row in match_ids.iterrows():
			matchId = row.match_id

			url = f"https://americas.api.riotgames.com/lol/match/v5/matches/{matchId}?api_key={api_key}"

			response = requests.get(url)
			
			if response.status_code == 200:
				match_data = response.json()
				allMatches.append(match_data)

			
			matchIdProcessed.append(matchId)
			if (index + 1) % 100 == 0:
				print(len(match_ids))				
				time.sleep(121) # Sleep 121 seconds so that it won't hit the rate limit

			if (index + 1) % 10000 == 0:
				print(index + 1, 'Dumping to JSON')
				with open('match_data.json', 'w') as file:
					json.dump(allMatches, file)


		with open('match_data.json', 'w') as file:
			json.dump(allMatches, file)
	
	except Exception as e: print(e)
	finally:
		df = pd.DataFrame({ 'match_id': matchIdProcessed })
		df.to_csv("./MatchIDsProcess.csv")

		with open('match_data.json', 'w') as file:
			json.dump(allMatches, file)
```

- Start to process and retrieve the data and save it in a json file. However I think it is too much data. I have failed twice so far and saved the results two two different json files. 
	- One contains ~1700 records
	- Second onctina ~3400 objects, I am unable to open this file in VSCode as it just crashed my computer

- I think I should convert the records I get from the API into a pandas row then save that as a CSV afterwards
	- This will require me map the objects to rows that I desire. Will need to think about what columns I want because I want to only do this once.
		- On the bright side I can play around with my current ~5000 records. 

### 3/11/25

- Due to the data being too large, I decieded to condense it as I save it. The format I landed on was:

```py
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
		'goldDifference': blue_gold - red_gold, # Negactive number means red side is ahead
		'blueGrubCount': match_data['info']['teams'][0]['objectives']['horde']['kills'],
		'redGrubCount': match_data['info']['teams'][1]['objectives']['horde']['kills'],
		'blueDragonCount': match_data['info']['teams'][0]['objectives']['dragon']['kills'],
		'redDragonCount': match_data['info']['teams'][1]['objectives']['dragon']['kills'],
		'blueBaronCount': match_data['info']['teams'][0]['objectives']['baron']['kills'],
		'redBaronCount': match_data['info']['teams'][1]['objectives']['baron']['kills'],
		'blueAtakhan': match_data['info']['teams'][0]['objectives']['atakhan']['kills'],
		'redAtakhan': match_data['info']['teams'][1]['objectives']['atakhan']['kills'],
		'winner': getWinner(match_data['info']['teams']) # 0 = Blue side, 1 = Red Side
```

- Additionally I am filtering out any games that end prior to 15 mins, because this is most likely an FF due to AFK. If it wasn't due to an AFK there is probably some level of trolling going on that makes the data not valid.

### 3/12/25

- I have gathered about 4000 rows, I am still waiting on the script to complete (should take another day or two) but want to start working on some of the models I want to create

- Want to attempt to use `pytorch` at some point in this project, I think it will give me more flexibility.

- Model ideas
	- Predict Gold Difference at 14 min
	- Predict winner
	- Predict number of grubs (or horde as RIOT api calls them)

- Data Visualization
	- Display number of champions played as well as their win rates
	- Display any corelation between atakahan and winning the game
	- Display what the most important objective is (grubs, dragons, atakahn, baron)
		- My assumption would be the baron but might be interesting to see, need to be aware of causation vs corelation. Meaning that the winning team is probably going to get more objectives, however this doesn't mean getting the objective wins you the game for example.

- Predict Gold Difference at 14 mins

- Going to attempt to use a simple Linear Regression model to predict the goal difference at 14 mins. Going to use sklearn models:
	- Linear Regression: Simple
	- Lasso Regression (L1)
		- Want to try this to see if it will remove any variables, might be interesting since my features for this will just be the champions in the game so if it determines X role is not useful might be interesting
	- Ridge Regressino (L2)
		- Same reason as Lasso but used a different formula.


#### Attempt 1

- Setup a simple LR model include the champions only 

- Results:
```
MSE (training data): 12353986.67
MSE (test data): 12902874.48
```