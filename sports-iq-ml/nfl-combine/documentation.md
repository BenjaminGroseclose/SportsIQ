# NFL Combine - Round Prediction

Goal: Predict round that players are drafted in based on their combine stats 

## Journal 

### 3/8/24

- Collected data from a [Kaggle resource](https://www.kaggle.com/datasets/savvastj/nfl-combine-data?resource=download) initially I think the data is good but I would like to add the college the players attended as often time players at "bigger" schools get more attention.
	- The dataset contains:
		- `Player,Pos,Ht,Wt,Forty,Vertical,BenchReps,BroadJump,Cone,Shuttle,Year,Pfr_ID,AV,Team,Round,Pick`

- First question to answer is what to do about the empty data (player did not compete in the event) I think we just update them to be 0 initall and see how that works.

- Players at the combined but did not get draft might be an interesting data point to evaluate though.

_____

#### Attempt 1

- PreProcessing Steps:
	- Drop rows that do not have `Round` as we cannot predict with them
	- Reduce the number of features the to the ones we care about
		- Features (X): `Pos,Ht,Wt,Forty,Vertical,BenchReps,BroadJump,Cone,Shuttle,Year`
		- Result (y): `Round`
	- Update all `nan` to be 0
	- Encode data (Positions)
	- MinMaxScale the data

- First Model I want to try to RandomForestClassifier because there are various data points and I think some are more important than others based on your position. I believe random forest can help to find those connects between two features (data points) since it random selects the features to be used by the tree.
	
Results:

```
accuracy score (training data): 1.00
accuracy_score (test data): 0.19
```

Lessons:
- Updating all `nan` values to 0 might not be ideal, maybe we should make it the mean of the column?


#### Attempt 2

- Same as Attempt 1 except `nan` values are going to be updated to the mean of the column

```py
for f in features:
	if (f == 'Pos'):
		continue

	X[f].fillna((X[f].mean()))
```

Results:

```
accuracy score (training data): 1.00
accuracy_score (test data): 0.20
```

Lessons:
- The 100% train data and 20% test data implys that the models is overfitting. I think I need to setup a k-fold cross validation try various differnt paremeters to the random forest model

#### Attempt 3

- Similar to Attempt 2 but use k-fold cross validation
	- Basically split the train / test in different ways to see what amount makes the most sense

```py
kf = KFold(n_splits=10)
kf.get_n_splits(X)

KFold(n_splits=2, random_state=None, shuffle=False)

model =  RandomForestClassifier()

predictions = cross_val_predict(model, X, y, cv=kf)
scores = cross_val_score(model, X, y, cv=kf)

print(predictions)
print(scores)
```

Results:
```
10 K-fold
[0.23529412 0.24064171 0.19786096 0.18983957 0.18716578 0.1684492
 0.19251337 0.18716578 0.18766756 0.17158177]
```

Overall not improving a ton, our first attempt was 0.19 and after our third attempt using kfold the second fold is at 0.24. 

I am starting to wonder if we need more data.
- If that is the case I might pull it from Football reference but would need to manually be done.

#### Attempt 4:

- Similar to attempt 2:  but want to predict one position specifically to see if the variety of position is negatively affecting the model

Results:
```
0.5 Split
accuracy score (training data): 1.00
accuracy_score (test data): 0.18

10 K-fold
[0.21925134 0.23262032 0.21390374 0.17112299 0.18181818 0.1631016
 0.18983957 0.20855615 0.18230563 0.17158177]
```

#### Attempt 5:

- I am removing data where players were not draft, instead update Y to be 8 (after the 7 rounds). 
	- Goal is to get more data for the model

Results:
```
0.5 Split
accuracy score (training data): 1.00
accuracy_score (test data): 0.40

10 K-fold
[0.39549839 0.38745981 0.3778135  0.3681672  0.35691318 0.33601286
 0.32958199 0.3392283  0.36070853 0.52012882]
```

Lessons:
- Adding in the undraft players increase the accuracy but I think this reinforces my belief that I need to get more data because 3k of the 6k record wher around 8 and adding it nearly doubled my results


#### Attempt 6 

- I have gathered more data 2000 - 2024 and include a "college" column data is from [pro-football-reference](https://www.pro-football-reference.com/draft/2000-combine.htm)
	- 6000 -> 8322 records

I ran the data through the same pre processing and model.

Results:
```
accuracy score (training data): 1.00
0.5 Split score: 0.36
k-Fold:  0 :  0.3233173076923077
k-Fold:  1 :  0.4362980769230769
k-Fold:  2 :  0.3449519230769231
k-Fold:  3 :  0.35216346153846156
k-Fold:  4 :  0.3389423076923077
k-Fold:  5 :  0.3473557692307692
k-Fold:  6 :  0.34615384615384615
k-Fold:  7 :  0.36899038461538464
k-Fold:  8 :  0.3629807692307692
k-Fold:  9 :  0.38341346153846156
```

- Similar results when we had less data, might want to dig into what features are having the most impact on the model. Will need to investigate how we can handle that.

- Might need to implement a neural network

#### Attempt 7

- Want to change to result to be "draft day" (day 1, 2, 3) this will hopefully help the model test accuracy while still maintaining the essense of the question

```py
def day_map(round):
	if round is np.nan:
		return np.nan
	
	if round == 1:
		return 1
	
	if round == 2 or round == 3:
		return 2
	
	return 3
```

Results:

```
accuracy score (training data): 1.00
0.5 Split score: 0.70
k-Fold: 0 : 0.6838942307692307
k-Fold: 1 : 0.7415865384615384
k-Fold: 2 : 0.703125
k-Fold: 3 : 0.7007211538461539
k-Fold: 4 : 0.6923076923076923
k-Fold: 5 : 0.6983173076923077
k-Fold: 6 : 0.703125
k-Fold: 7 : 0.7055288461538461
k-Fold: 8 : 0.7103365384615384
k-Fold: 9 : 0.7115384615384616
```

Lessons: Removing the number of classifications increase the accuracy, another way of viewing it is that there is more data for each classification so might continue to gather data for the rounds