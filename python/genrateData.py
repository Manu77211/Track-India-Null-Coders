import os
import json
from pymongo import MongoClient
from dotenv import load_dotenv

# Load environment variables
load_dotenv()
MONGO_URI = os.getenv("MONGO_URI")

# Connect to MongoDB
client = MongoClient(MONGO_URI, tlsAllowInvalidCertificates=True)
db = client["track_karnataka"]

# Collections to combine
collections = [
    "gst_revenue_collection",
    "printing_details_2019_20",
    "inflation_rate",
    "petroleum_production",
    "agriculture_data",
    "state_cpi"
]

combined_data = []

for coll_name in collections:
    collection = db[coll_name]
    records = list(collection.find({}, {"_id": 0}))  # Exclude MongoDB _id field
    for record in records:
        combined_data.append({
            "id": f"{coll_name}_{record.get('year', '')}_{record.get('district', '')}_{record.get('month', '')}",
            "collection": coll_name,
            "fields": record
        })

# Ensure /data folder exists
os.makedirs("data", exist_ok=True)

# Save combined JSON in /data/data.json
output_path = os.path.join("data", "data.json")
with open(output_path, "w", encoding="utf-8") as f:
    json.dump(combined_data, f, indent=4, ensure_ascii=False)

print(f"✅ Combined {len(combined_data)} records saved to '{output_path}'")
