from flask import Flask

app = Flask(__name__)

@app.route("/")
def home():
    return "Hi 👋 Flask is running successfully inside virtual environment!"

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8010, debug=True)
