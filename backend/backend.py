import os
from flask import Flask, jsonify
from flask.globals import request
from flask.helpers import make_response, send_file
import csv
import pandas as pd
import dateutil.parser

app = Flask(__name__)

BASE_DIR_DATA="./"
BASE_DIR_STATS="./stats/"

@app.route('/<file_name>/upload/', methods=["GET","POST"])
def upload_csv(file_name):
    req = request.get_data()
    if(req!=None):
        write_csv(file_name,req.decode("utf-8"))

    res = make_response(jsonify({"Message": "CSV Uploaded"}), 201)
    return res

@app.route('/<file_name>')
@app.route('/<file_name>/download/')
def retrieve_csv(file_name):

    path=BASE_DIR_DATA+file_name
    if not os.path.exists(path):
        return make_response(jsonify({"Error": "No file found"}), 404)
    
    if os.path.isfile(path):
        return send_file(path)

@app.route('/<file_name>/statistics/') 
def get_statistics(file_name):

    path=BASE_DIR_DATA+file_name

    if not os.path.isfile(path):
        return make_response(jsonify({"Error": "No file found"}), 404)

    if os.path.isfile(path):
            if(generate_year_statistics(file_name,BASE_DIR_STATS+"stats_"+file_name)):
                return send_file(BASE_DIR_STATS+"stats_"+file_name)
            else:
                return make_response(jsonify({"Error": "No date data found"}), 404)

        

def write_csv(file_name, csv_body):
    with open(file_name, "w") as csv_file:
        writer = csv.writer(csv_file)
        for r in csv_body.split('\n'):
            r.replace("\"", "")
            writer.writerow(r.split(','))
        csv_file.close()

def generate_year_statistics(file_name, path):
    df=pd.read_csv(file_name)
    if "date" in df.columns:
        df=df[["date"]]
        df["date"]=df["date"].apply(lambda x: str(dateutil.parser.parse(x.replace("\"","")).year) if isinstance(x,str) else x)
        df=df.value_counts().sort_index(ascending=True)
        df.to_csv(path)
        return True
    else:
        return False
    