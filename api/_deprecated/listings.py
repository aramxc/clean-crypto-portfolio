import requests
import json
import os
import time
from settings import get_api_key

LOCAL_CURRENCY = 'USD'  # pass in different currencies here
CURRENCY_SYMBOL = '$'

API_KEY = get_api_key("API_KEY")

HEADERS = {'X-CMC_PRO_API_KEY': API_KEY}
BASE_URL = 'https://pro-api.coinmarketcap.com'
LISTINGS_URL = BASE_URL + '/v1/cryptocurrency/listings/latest?convert=' + LOCAL_CURRENCY
CACHE_FILE = "cached_crypto_data.json"
CACHE_REFRESH_INTERVAL = 60  # in seconds


def fetch_and_cache_latest_data():
    """Fetch latest data for all cryptocurrencies and cache it."""
    print("Fetching latest cryptocurrency data...")
    listings_url = f'{BASE_URL}/v1/cryptocurrency/listings/latest?limit=5000&convert={LOCAL_CURRENCY}'
    response = requests.get(listings_url, headers=HEADERS)
    data = response.json()

    with open(CACHE_FILE, 'w') as cache_file:
        json.dump(data, cache_file)

    print("Data cached successfully.")


def load_cached_data():
    # Load cached data from the file
    if not os.path.exists(CACHE_FILE) or time.time() - os.path.getmtime(CACHE_FILE) > CACHE_REFRESH_INTERVAL:
        fetch_and_cache_latest_data()

    with open(CACHE_FILE, 'r') as cache_file:
        return json.load(cache_file)


def get_crypto_data(symbol, cached_data):
    # Retrieve cryptocurrency data for a specific symbol from the cached data
    for currency in cached_data['data']:
        if currency['symbol'] == symbol:
            return currency
    return None


request = requests.get(LISTINGS_URL, headers=HEADERS)
result = request.json()

data = result["data"]

for currency in data:
    name = currency["name"]
    symbol = currency["symbol"]

    price = round(currency['quote'][LOCAL_CURRENCY]['price'], 2)
    percent_change_24h = round(currency['quote'][LOCAL_CURRENCY]['percent_change_24h'], 2)
    market_cap = round(currency['quote'][LOCAL_CURRENCY]['market_cap'], 2)

    formatted_price = CURRENCY_SYMBOL + '{:,}'.format(price)
    formatted_percent_change_24h = CURRENCY_SYMBOL + '{:,}'.format(percent_change_24h)
    formatted_market_cap = CURRENCY_SYMBOL + '{:,}'.format(market_cap)

    print(name + ' (' + CURRENCY_SYMBOL + ')')
    print('Price: ' + formatted_price)
    print('24H Change: ' + formatted_percent_change_24h)
    print('Market Cap: ' + formatted_market_cap)
