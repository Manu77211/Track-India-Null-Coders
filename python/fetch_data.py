import os
import requests
from pymongo import MongoClient
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")
API_KEY = os.getenv("API_KEY")

# MongoDB connection
client = MongoClient(MONGO_URI, tlsAllowInvalidCertificates=True)
db = client["track_karnataka"]

# Dataset dictionary: {"collection_name": "resource_id"}
datasets = {
    "gst_revenue_collection": "14613c4e-5ab0-4705-b440-e4e49ae345de",
    "printing_details_2019_20": "2b9561ee-bc24-4458-bf79-ac5b9dfc119d",
    "inflation_rate": "352b3616-9d3d-42e5-80af-7d21a2a53fab",
    "petroleum_production": "8b75d7c2-814b-4eb2-9698-c96d69e5f128"  # example new dataset
}

# Structuring functions
def structure_gst_record(record):
    return {
        "district": record.get("district_name"),
        "financial_year": record.get("financial_year"),
        "total_gst_collected": float(record.get("total_gst_collected", 0)),
        "cgst": float(record.get("cgst", 0)),
        "sgst": float(record.get("sgst", 0)),
        "igst": float(record.get("igst", 0)),
        "metadata": {
            "resource_id": record.get("resource_id", ""),
            "source": "data.gov.in"
        }
    }

def structure_petroleum_record(record, dataset_info=None):
    return {
        "month": record.get("month"),
        "year": int(record.get("year", 0)),
        "products": record.get("products"),
        "quantity_000_metric_tonnes": float(record.get("quantity_000_metric_tonnes_", 0)),
        "updated_date": record.get("updated_date"),
        "metadata": {
            "dataset_id": dataset_info.get("index_name") if dataset_info else "",
            "title": dataset_info.get("title") if dataset_info else "",
            "source": dataset_info.get("source", "data.gov.in") if dataset_info else "data.gov.in"
        }
    }

# Generic fetch & store function
def fetch_and_store_structured(resource_id, collection_name, struct_func=None, dataset_info=None, limit=1000, offset=0):
    url = f"https://api.data.gov.in/resource/{resource_id}"
    params = {
        "api-key": API_KEY,
        "format": "json",
        "limit": limit,
        "offset": offset
    }

    try:
        response = requests.get(url, params=params)
        response.raise_for_status()
        data = response.json()

        if "records" in data and len(data["records"]) > 0:
            collection = db[collection_name]
            records = [struct_func(r, dataset_info) for r in data["records"]] if struct_func else data["records"]
            collection.insert_many(records)
            print(f"✅ Inserted {len(records)} structured records into '{collection_name}'")
        else:
            print(f"❌ No records found for {collection_name}")

    except Exception as e:
        print(f"❌ Failed to fetch/store {collection_name}: {e}")

if __name__ == "__main__":
    # Example usage
    for collection_name, resource_id in datasets.items():
        if collection_name == "gst_revenue_collection":
            fetch_and_store_structured(resource_id, collection_name, struct_func=structure_gst_record)
        elif collection_name == "petroleum_production":
            fetch_and_store_structured(resource_id, collection_name, struct_func=structure_petroleum_record, dataset_info={
                "index_name": "8b75d7c2-814b-4eb2-9698-c96d69e5f128",
                "title": "Monthly Production of Petroleum Products by Refineries & Fractionators",
                "source": "data.gov.in"
            })
        else:
            fetch_and_store_structured(resource_id, collection_name)  # default: store raw JSON
