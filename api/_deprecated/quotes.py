import requests
import json
from settings import get_api_key

LOCAL_CURRENCY = 'USD'  # pass in different currencies here
CURRENCY_SYMBOL = '$'

API_KEY = get_api_key("API_KEY")

HEADERS = {'X-CMC_PRO_API_KEY': API_KEY}
BASE_URL = 'https://pro-api.coinmarketcap.com'

symbol = input("Input ticker of a cryptocurrency: ")  # modify here for dynamic UI input

LISTINGS_URL = BASE_URL + '/v1/cryptocurrency/quotes/latest?convert=' + LOCAL_CURRENCY + '&symbol=' + symbol

request = requests.get(LISTINGS_URL, headers=HEADERS)
result = request.json()

data = result["data"]
currency = data[symbol]

name = currency["name"]

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
