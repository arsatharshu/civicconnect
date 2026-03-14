from flask import Flask, request, jsonify, render_template
from pymongo import MongoClient

app = Flask(__name__)

# connect local MongoDB
client = MongoClient("mongodb://localhost:27017/")

db = client["civicconnect"]
collection = db["issues"]

@app.route("/")
def home():
    return render_template("index.html")


@app.route("/report_issue", methods=["POST"])
def report_issue():

    data = request.json
    name = data.get("name")
    issue = data.get("issue")

    collection.insert_one({
        "name": name,
        "issue": issue
    })

    return jsonify({"message":"Issue Submitted Successfully"})


@app.route("/issues")
def view_issues():

    issues = []

    for issue in collection.find():
        issues.append({
            "id": str(issue["_id"]),
            "name": issue["name"],
            "issue": issue["issue"]
        })

    return jsonify(issues)


if __name__ == "__main__":
    app.run(debug=True)