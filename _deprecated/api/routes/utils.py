import os
import json
import time
import requests
from dotenv import load_dotenv

# Load API key from .env file
load_dotenv()
API_KEY = os.getenv('CMC_API_KEY')

BASE_URL = 'https://pro-api.coinmarketcap.com'
LISTINGS_URL = f'{BASE_URL}/v1/cryptocurrency/listings/latest?convert=USD'
HEADERS = {'X-CMC_PRO_API_KEY': API_KEY}

CACHE_FILE = "cached_crypto_data.json"
CACHE_REFRESH_INTERVAL = 60  # seconds


def fetch_and_cache_latest_data():
    """Fetch and cache the latest cryptocurrency data."""
    print("Fetching latest cryptocurrency data...")
    response = requests.get(LISTINGS_URL, headers=HEADERS)
    if response.status_code == 200:
        with open(CACHE_FILE, 'w') as cache_file:
            json.dump(response.json(), cache_file)
        print("Data cached successfully.")
    else:
        print(f"Failed to fetch data: {response.status_code} - {response.text}")


def load_cached_data():
    """Load cached data or refresh if needed."""
    if not os.path.exists(CACHE_FILE) or time.time() - os.path.getmtime(CACHE_FILE) > CACHE_REFRESH_INTERVAL:
        fetch_and_cache_latest_data()
    with open(CACHE_FILE, 'r') as cache_file:
        return json.load(cache_file)


def get_crypto_data(symbol, cached_data):
    """Get cryptocurrency data for a given symbol."""
    return next((currency for currency in cached_data['data'] if currency['symbol'] == symbol), None)