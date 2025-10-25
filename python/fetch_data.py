import os
import requests
from pymongo import MongoClient
from dotenv import load_dotenv

# ======================
# Load environment variables
# ======================
load_dotenv()
MONGO_URI = os.getenv("MONGO_URI")
API_KEY = os.getenv("API_KEY")

# ======================
# MongoDB connection
# ======================
client = MongoClient(MONGO_URI, tlsAllowInvalidCertificates=True)
db = client["track_karnataka"]

# ======================
# Dataset Configuration
# ======================
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
    "agriculture_land_utilisation": {
        "resource_id": "c8abc82f-b750-4886-a6c7-e97150fdda9e",
        "struct_func": lambda r, _: {
            "year": r.get("year__1_"),
            "geographical_area": float(r.get("geographical_area__2_", 0)),
            "reporting_area": float(r.get("reporting_area_for_land_utilisation_statistics__col_4_7__11_14_15___3_", 0)),
            "forests": float(r.get("forests__4_", 0)),
            "non_agri_uses": float(r.get("not_available_for_cultivation_area_under_non_agri_cultural_uses__5_", 0)),
            "barren_land": float(r.get("not_available_for_cultivation_barren_and_uncultur_able_land__6_", 0)),
            "not_available_total": float(r.get("not_available_for_cultivation_total__col_5_6___7_", 0)),
            "other_uncultivated_pastures": float(r.get("other_uncultivated_land_excluding_fallow_land_permanent_pastures___other_grazing_lands__8_", 0)),
            "misc_tree_crops": float(r.get("other_uncultivated_land_excluding_fallow_land_land_under_misc_tree_crops___groves__not_incl__in_net_area_sown___9_", 0)),
            "culturable_waste_land": float(r.get("other_uncultivated_land_excluding_fallow_land_culturable_waste_land__10_", 0)),
            "other_uncultivated_total": float(r.get("other_uncultivated_land_excluding_fallow_land_total__col_8_to_10___11_", 0)),
            "fallow_other_than_current": float(r.get("fallow_lands_fallow_lands_other_than_current_fallows__12_", 0)),
            "current_fallows": float(r.get("fallow_lands_current_fallows__13_", 0)),
            "fallow_total": float(r.get("fallow_lands_total_col_12_13___14_", 0)),
            "net_area_sown": float(r.get("net_area_sown__15_", 0)),
            "total_cropped_area": float(r.get("total_cropped_area__16_", 0)),
            "area_sown_more_than_once": float(r.get("area_sown_more_than_once__col_16_15___17_", 0)),
            "agricultural_land_total": float(r.get("agricultural_land_culti_vable_land_cultur_able_land_arable_land__col_9_10_14_15___18_", 0)),
            "cultivated_land": float(r.get("cultivated_land__col_13_15___19_", 0)),
            "cropping_intensity": float(r.get("cropping_intensity___of_col_16_over_col_15___20_", 0)),
            "metadata": {
                "resource_id": "c8abc82f-b750-4886-a6c7-e97150fdda9e",
                "title": "All India level Pattern of Land Utilisation From 2000-01 to 2013-14",
                "source": "data.gov.in"
            }
        }
    }
}

# ======================
# Generic fetch & store function
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
