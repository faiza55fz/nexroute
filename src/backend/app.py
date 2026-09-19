from importlib import import_module

Flask = import_module("flask").Flask
jsonify = import_module("flask").jsonify
CORS = import_module("flask_cors").CORS
import requests

app = Flask(__name__)
CORS(app)


@app.route("/api/weather")
def weather():
    latitude = 27.33
    longitude = 88.61

    url = "https://api.open-meteo.com/v1/forecast"

    params = {
        "latitude": latitude,
        "longitude": longitude,
        "current": "temperature_2m,precipitation,wind_speed_10m",
        "hourly": "precipitation_probability",
        "forecast_days": 1
    }

    response = requests.get(url, params=params, timeout=10)

    if response.status_code != 200:
        return jsonify({
            "error": "Unable to fetch weather data"
        }), 500

    data = response.json()

    current = data.get("current", {})

    precipitation = current.get("precipitation", 0)

    if precipitation >= 10:
        risk = "High"
        accessibility = 32
    elif precipitation >= 3:
        risk = "Medium"
        accessibility = 65
    else:
        risk = "Low"
        accessibility = 91

    return jsonify({
        "location": "Gangtok",
        "temperature": current.get("temperature_2m"),
        "precipitation": precipitation,
        "wind_speed": current.get("wind_speed_10m"),
        "risk": risk,
        "accessibility_score": accessibility
    })


@app.route("/api/health")
def health():
    return jsonify({
        "status": "NexRoute backend is running"
    })


if __name__ == "__main__":
    app.run(debug=True, port=5000)