from flask import Flask, jsonify, request
from flask_cors import CORS
import random
from datetime import datetime

app = Flask(__name__)
# Enable CORS so Next.js frontend can make requests
CORS(app)

# Mock data generator (until MongoDB is ready)
def generate_trend_data(sector, district):
    """Generate realistic trend data based on sector and district"""
    # Different base values for each sector
    sector_bases = {
        'Health': 65,
        'Education': 75,
        'Infrastructure': 70,
        'Water': 60,
    }
    
    # District multipliers to create variation
    district_multipliers = {
        'Bangalore': 1.15,
        'Bangalore Urban': 1.15,
        'Mysuru': 1.05,
        'Mysore': 1.05,
        'Mangalore': 1.00,
        'Hubli': 0.95,
        'Belgaum': 0.90,
        'Mumbai': 1.20,
        'Pune': 1.12,
        'Nagpur': 1.00,
        'Chennai': 1.18,
        'Coimbatore': 1.08,
        'Madurai': 0.98,
    }
    
    base = sector_bases.get(sector, 70)
    multiplier = district_multipliers.get(district, 1.0)
    starting_value = base * multiplier
    
    trends = []
    for i, year in enumerate(range(2020, 2027)):
        # Progressive growth with some randomness
        growth = i * 3 + random.uniform(-1, 1)
        value = round(starting_value + growth, 1)
        value = max(30, min(100, value))  # Keep between 30-100
        
        trends.append({
            'year': year,
            'value': value,
            'confidence_low': max(30, value - 6),
            'confidence_high': min(100, value + 6)
        })
    
    return trends

def generate_drivers_data(sector):
    """Generate top drivers for each sector"""
    drivers_map = {
        'Health': [
            {'name': 'Healthcare Funding', 'value': 85, 'impact': 'high', 'trend': 'up'},
            {'name': 'Doctor Availability', 'value': 72, 'impact': 'high', 'trend': 'stable'},
            {'name': 'Hospital Infrastructure', 'value': 68, 'impact': 'medium', 'trend': 'up'},
            {'name': 'Sanitation Programs', 'value': 78, 'impact': 'medium', 'trend': 'up'},
            {'name': 'Health Insurance', 'value': 65, 'impact': 'medium', 'trend': 'stable'},
        ],
        'Education': [
            {'name': 'School Infrastructure', 'value': 90, 'impact': 'high', 'trend': 'up'},
            {'name': 'Teacher Training', 'value': 82, 'impact': 'high', 'trend': 'stable'},
            {'name': 'Digital Resources', 'value': 75, 'impact': 'medium', 'trend': 'up'},
            {'name': 'Literacy Programs', 'value': 88, 'impact': 'high', 'trend': 'up'},
            {'name': 'Student-Teacher Ratio', 'value': 70, 'impact': 'medium', 'trend': 'stable'},
        ],
        'Infrastructure': [
            {'name': 'Road Development', 'value': 80, 'impact': 'high', 'trend': 'up'},
            {'name': 'Electricity Access', 'value': 92, 'impact': 'high', 'trend': 'stable'},
            {'name': 'Water Supply', 'value': 68, 'impact': 'high', 'trend': 'up'},
            {'name': 'Internet Connectivity', 'value': 65, 'impact': 'medium', 'trend': 'up'},
            {'name': 'Public Transport', 'value': 58, 'impact': 'medium', 'trend': 'stable'},
        ],
        'Water': [
            {'name': 'Water Treatment Plants', 'value': 72, 'impact': 'high', 'trend': 'up'},
            {'name': 'Pipeline Infrastructure', 'value': 65, 'impact': 'high', 'trend': 'stable'},
            {'name': 'Water Quality Monitoring', 'value': 78, 'impact': 'medium', 'trend': 'up'},
            {'name': 'Rainwater Harvesting', 'value': 55, 'impact': 'medium', 'trend': 'up'},
            {'name': 'Groundwater Management', 'value': 60, 'impact': 'medium', 'trend': 'stable'},
        ],
    }
    
    return drivers_map.get(sector, drivers_map['Infrastructure'])

@app.route("/")
def home():
    return jsonify({
        "message": "Hi 👋 Flask API is running!",
        "status": "MongoDB pending - using mock data",
        "endpoints": [
            "/api/health",
            "/api/trends",
            "/api/drivers",
            "/api/districts",
        ]
    })

@app.route("/api/health")
def health():
    """Check if API is working"""
    return jsonify({
        "status": "healthy",
        "message": "API is running successfully!",
        "data_source": "Mock data (MongoDB pending)"
    })

@app.route("/api/trends")
def get_trends():
    """Get trend data for charts"""
    sector = request.args.get('sector', 'Health')
    district = request.args.get('district', 'Bangalore Urban')
    
    try:
        trends = generate_trend_data(sector, district)
        
        return jsonify({
            "success": True,
            "sector": sector,
            "district": district,
            "data": trends
        })
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@app.route("/api/drivers")
def get_drivers():
    """Get top drivers for a sector"""
    sector = request.args.get('sector', 'Health')
    
    try:
        drivers = generate_drivers_data(sector)
        
        return jsonify({
            "success": True,
            "sector": sector,
            "data": drivers
        })
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@app.route("/api/districts")
def get_districts():
    """Get list of available districts"""
    districts = {
        "Karnataka": [
            "Bangalore Urban", "Mysore", "Hubli", "Mangalore", "Belgaum",
            "Gulbarga", "Davanagere", "Bellary", "Bijapur", "Shimoga"
        ],
        "Maharashtra": [
            "Mumbai", "Pune", "Nagpur", "Thane", "Nashik",
            "Aurangabad", "Solapur", "Kolhapur"
        ],
        "Tamil Nadu": [
            "Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem",
            "Tirunelveli", "Tiruppur", "Erode"
        ]
    }
    
    state = request.args.get('state', 'Karnataka')
    
    return jsonify({
        "success": True,
        "state": state,
        "districts": districts.get(state, districts["Karnataka"])
    })

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8010, debug=True)
