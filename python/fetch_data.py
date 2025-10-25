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

# ======================
# Dataset Configuration
# ======================
# Each dataset defines:
#   - resource_id (required)
#   - struct_func (optional)
#   - dataset_info (optional metadata)
datasets = {
    "gst_revenue_collection": {
        "resource_id": "14613c4e-5ab0-4705-b440-e4e49ae345de",
        "struct_func": lambda r, _: {
            "district": r.get("district_name"),
            "financial_year": r.get("financial_year"),
            "total_gst_collected": float(r.get("total_gst_collected", 0)),
            "cgst": float(r.get("cgst", 0)),
            "sgst": float(r.get("sgst", 0)),
            "igst": float(r.get("igst", 0)),
            "metadata": {
                "resource_id": r.get("resource_id", ""),
                "source": "data.gov.in"
            }
        }
    },
    "printing_details_2019_20": {
        "resource_id": "2b9561ee-bc24-4458-bf79-ac5b9dfc119d"
        # No struct_func → raw JSON will be stored
    },
    "inflation_rate": {
        "resource_id": "352b3616-9d3d-42e5-80af-7d21a2a53fab"
    },
    "petroleum_production": {
        "resource_id": "8b75d7c2-814b-4eb2-9698-c96d69e5f128",
        "struct_func": lambda r, info: {
            "month": r.get("month"),
            "year": int(r.get("year", 0)),
            "products": r.get("products"),
            "quantity_000_metric_tonnes": float(r.get("quantity_000_metric_tonnes_", 0)),
            "updated_date": r.get("updated_date"),
            "metadata": {
                "dataset_id": info.get("index_name") if info else "",
                "title": info.get("title") if info else "",
                "source": info.get("source", "data.gov.in") if info else "data.gov.in"
            }
        },
        "dataset_info": {
            "index_name": "8b75d7c2-814b-4eb2-9698-c96d69e5f128",
            "title": "Monthly Production of Petroleum Products by Refineries & Fractionators",
            "source": "data.gov.in"
        }
    },
    "agriculture_data": {
        "resource_id": "c8abc82f-b750-4886-a6c7-e97150fdda9e",
        "struct_func": lambda r, _: {
            "state": r.get("state_name"),
            "district": r.get("district_name"),
            "crop": r.get("crop_name"),
            "season": r.get("season"),
            "production": float(r.get("production", 0)),
            "area": float(r.get("area", 0)),
            "yield": float(r.get("yield", 0)),
            "year": int(r.get("year", 0)),
            "metadata": {
                "resource_id": "c8abc82f-b750-4886-a6c7-e97150fdda9e",
                "source": "data.gov.in"
            }
        }
    },
    "state_cpi": {
        "resource_id": "41fb8750-5afa-4395-a895-19d3f5015c27",
        "struct_func": lambda r, _: {
            # Basic fields
            "sector": r.get("sector"),
            "year": int(r.get("year", 0)),
            "month": r.get("name"),
            # Dynamic loop over all state fields
            **{
                k: (float(v) if v != "NA" else None)
                for k, v in r.items()
                if k not in ["sector", "year", "name"]
            },
            "metadata": {
                "resource_id": "41fb8750-5afa-4395-a895-19d3f5015c27",
                "title": "State Level Consumer Price Index (Rural/Urban) upto May-2021",
                "source": "data.gov.in"
            }
        }
    }
}

# ======================
# Generic fetch & store
# ======================
def fetch_and_store(resource_config, collection_name, limit=1000, offset=0):
    resource_id = resource_config["resource_id"]
    struct_func = resource_config.get("struct_func")
    dataset_info = resource_config.get("dataset_info")

    url = f"https://api.data.gov.in/resource/{resource_id}"
    params = {"api-key": API_KEY, "format": "json", "limit": limit, "offset": offset}

    try:
        response = requests.get(url, params=params)
        response.raise_for_status()
        data = response.json()

        if "records" in data and len(data["records"]) > 0:
            collection = db[collection_name]
            records = [struct_func(r, dataset_info) for r in data["records"]] if struct_func else data["records"]
            collection.insert_many(records)
            print(f"✅ Inserted {len(records)} records into '{collection_name}'")
        else:
            print(f"❌ No records found for '{collection_name}'")

    except Exception as e:
        print(f"❌ Failed to fetch/store '{collection_name}': {e}")

# ======================
# Main execution
# ======================
if __name__ == "__main__":
    for collection_name, config in datasets.items():
        print(f"Fetching dataset: {collection_name}")
        fetch_and_store(config, collection_name)
