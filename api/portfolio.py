import os
import json
import requests
import time
from prettytable import PrettyTable
from colorama import Fore, Back, Style
from flask import Flask, request, jsonify
from settings import get_api_key

app = Flask(__name__)

LOCAL_CURRENCY = 'USD'  # Pass in different currencies here
CURRENCY_SYMBOL = '$'

API_KEY = get_api_key("API_KEY")
HEADERS = {'X-CMC_PRO_API_KEY': API_KEY}
BASE_URL = 'https://pro-api.coinmarketcap.com'
LISTINGS_URL = f'{BASE_URL}/v1/cryptocurrency/listings/latest?convert={LOCAL_CURRENCY}'
CACHE_FILE = "cached_crypto_data.json"
CACHE_REFRESH_INTERVAL = 60  # in seconds


def fetch_and_cache_latest_data():
    """Fetch and cache the latest cryptocurrency data."""
    print("Fetching latest cryptocurrency data...")
    response = requests.get(LISTINGS_URL, headers=HEADERS)
    if response.status_code == 200:
        data = response.json()
        with open(CACHE_FILE, 'w') as cache_file:
            json.dump(data, cache_file)
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
    for currency in cached_data['data']:
        if currency['symbol'] == symbol:
            return currency
    return None


@app.route('/portfolio', methods=['POST'])
def portfolio():
    """Handle portfolio requests and return portfolio data."""
    ticker_symbols = request.json.get('tickers', [])
    portfolio_value = 0.00
    table = PrettyTable(['Asset', 'Amount Owned', 'Value', 'Price', '1H', '24H', '7D'])

    cached_data = load_cached_data()

    for symbol in ticker_symbols:
        symbol = symbol.upper()
        amount = 1  # Placeholder amount, adjust as needed
        currency = get_crypto_data(symbol, cached_data)

        if currency:
            quote = currency['quote'][LOCAL_CURRENCY]
            one_hour_change = round(quote['percent_change_1h'], 1)
            day_change = round(quote['percent_change_24h'], 1)
            week_change = round(quote['percent_change_7d'], 1)

            price = quote['price']
            formatted_price = '{:,}'.format(round(price, 2))
            value = float(price) * float(amount)
            formatted_value = '{:,}'.format(round(value, 2))

            portfolio_value += value
            formatted_portfolio_value = str('{:,}'.format(round(portfolio_value, 2)))

            one_hour_change = (Back.GREEN if one_hour_change > 0 else Back.RED) + str(one_hour_change) + '%' + Style.RESET_ALL
            day_change = (Back.GREEN if day_change > 0 else Back.RED) + str(day_change) + '%' + Style.RESET_ALL
            week_change = (Back.GREEN if week_change > 0 else Back.RED) + str(week_change) + '%' + Style.RESET_ALL

            table.add_row([
                f"{currency['name']} ({symbol})",
                amount,
                f"{CURRENCY_SYMBOL}{formatted_value}",
                f"{CURRENCY_SYMBOL}{formatted_price}",
                one_hour_change,
                day_change,
                week_change
            ])
        else:
            print(f"Error: No data found for symbol '{symbol}'.")

    print(table)
    print(f"\nTotal Portfolio Value: {CURRENCY_SYMBOL}{formatted_portfolio_value}")

    return jsonify({
        'portfolio_value': portfolio_value,
        'table': table.get_string()
    })


@app.route('/ticker-list', methods=['GET'])
def ticker_list():
    """Return a list of available ticker symbols."""
    cached_data = load_cached_data()
    tickers = [{'label': currency['symbol'], 'id': index} for index, currency in enumerate(cached_data['data'], start=1)]
    return jsonify(tickers)


if __name__ == "__main__":
    app.run(debug=True)