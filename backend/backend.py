import os
from flask import Flask, jsonify, Response
from flask.globals import request
from flask.helpers import make_response, send_file
import csv
import pandas as pd
from io import StringIO

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
            generate_year_statistics(file_name,BASE_DIR_STATS+"stats_"+file_name)
            return send_file(BASE_DIR_STATS+"stats_"+file_name)
        

def write_csv(file_name, csv_body):
    with open(file_name, "w") as csv_file:
        writer = csv.writer(csv_file)
        for r in csv_body.split('\n'):
            writer.writerow(r.split(','))
        csv_file.close()

def generate_year_statistics(file_name, path):
    df=pd.read_csv(file_name)
    df=df["date"]
    sl=slice(6,10)
    df=df.apply(lambda x: x[sl] if isinstance(x,str) else print(type(x)))
    df=df.value_counts(normalize=True).sort_index(ascending=True)
    df.to_csv(path)