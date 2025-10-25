import requests
import pandas as pd

# Dictionary of dataset names and their resource IDs
dataset_resource_ids = {
    "Printing Details for the Year 2019-20": "2b9561ee-bc24-4458-bf79-ac5b9dfc119d",
    "senior_citizen_card_report": "a6f7e6e9-3c0b-4d7e-9e2f-9c8f0f0a9e8e",
    "fire_service_vehicle_details": "a1b2c3d4-5e6f-7a8b-9c0d-1e2f3a4b5c6d",
    "post_matric_merit_cum_means_scholarship": "e9e9b2f3-3b9b-4b1e-bb5d-2f6b6f1a5d6d"
}

def fetch_data(resource_id, file_name):
    """
    Fetch data from Karnataka Open Data Portal using resource_id
    and save it as CSV in data/
    """
    if not resource_id:
        print(f"⚠️ Skipping {file_name}, resource ID missing")
        return

    url = f"https://karnataka.data.gov.in/api/3/action/datastore_search?resource_id={resource_id}&limit=1000"
    try:
        res = requests.get(url)
        res.raise_for_status()
        data = res.json()
        
        if "result" in data and "records" in data["result"]:
            records = data["result"]["records"]
            df = pd.DataFrame(records)
            df.to_csv(f"data/{file_name}.csv", index=False)
            print(f"✅ Saved {file_name}.csv with {len(df)} rows")
        else:
            print(f"❌ Failed to fetch {file_name}, no records found")
    except Exception as e:
        print(f"❌ Failed to fetch {file_name}: {e}")

if __name__ == "__main__":
    for name, resource_id in dataset_resource_ids.items():
        fetch_data(resource_id, name)
