from flask import Flask, request
from sklearn.ensemble import RandomForestClassifier
import pandas as pd
import pickle

# Command flask --app main run

app = Flask(__name__)


@app.route("/predict", methods=['POST'])
def predict():
    model: RandomForestClassifier = None

    with open("riot_classifier.pkl", "rb") as file:
        model = pickle.load(file)

    data = request.get_json()

    print(data)

    df = pd.DataFrame.from_dict(data)

    prediction = model.predict_proba(df)

    retval = {
        'blue': prediction[0][0],
        'red': prediction[0][1]
    }

    return retval
