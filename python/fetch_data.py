import requests
import pandas as pd
import os

# Ensure the data folder exists
os.makedirs("data", exist_ok=True)

# Your API key
API_KEY = "579b464db66ec23bdd000001cdd3946e44ce4aad7209ff7b23ac571b"

# Dictionary of dataset names and resource IDs
datasets = {
    # Fill this dictionary with {"name": "resource_id"}
    # Example:
     "gst_revenue_collection": "14613c4e-5ab0-4705-b440-e4e49ae345de",
      "printing_details_2019_20": "2b9561ee-bc24-4458-bf79-ac5b9dfc119d",
}

def fetch_data(resource_id, file_name, api_key, limit=1000, offset=0):
    """
    Generic function to fetch dataset from data.gov.in and save as CSV
    """
    url = f"https://api.data.gov.in/resource/{resource_id}"
    params = {
        "api-key": api_key,
        "format": "json",
        "limit": limit,
        "offset": offset
    }

    try:
        response = requests.get(url, params=params)
        response.raise_for_status()
        data = response.json()

        if "records" in data:
            records = data["records"]
            df = pd.DataFrame(records)
            safe_file_name = file_name.replace(" ", "_")
            df.to_csv(f"data/{safe_file_name}.csv", index=False)
            print(f"✅ Saved {safe_file_name}.csv with {len(df)} rows")
        else:
            print(f"❌ No records found for {file_name}")

    except Exception as e:
        print(f"❌ Failed to fetch {file_name}: {e}")

if __name__ == "__main__":
    for name, resource_id in datasets.items():
        fetch_data(resource_id, name, API_KEY)
