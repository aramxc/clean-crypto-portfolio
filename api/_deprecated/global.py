import requests
import json
from settings import get_api_key

LOCAL_CURRENCY = 'USD' # pass in different currencies here
CURRENCY_SYMBOL = '$'

API_KEY = get_api_key("API_KEY")

HEADERS = {'X-CMC_PRO_API_KEY': API_KEY}
BASE_URL = 'https://pro-api.coinmarketcap.com'
GLOBAL_URL = BASE_URL + '/v1/global-metrics/quotes/latest?convert=' + LOCAL_CURRENCY


request = requests.get(GLOBAL_URL, headers=HEADERS)
result = request.json()

data = result["data"]

total_market_cap = round(data["quote"][LOCAL_CURRENCY]["total_market_cap"], 2)
btc_dominance = round(data["btc_dominance"], 2)
eth_dominance = round(data["eth_dominance"], 2)
total_volume_24h = round(data["quote"][LOCAL_CURRENCY]["total_volume_24h"], 2)

formatted_total_market_cap = CURRENCY_SYMBOL + "{:,}".format(total_market_cap)
formatted_total_volume_24h = CURRENCY_SYMBOL + "{:,}".format(total_volume_24h)

print("The global market cap for all cryptocurrencies is: " + formatted_total_market_cap + " and the total 24h volume is " + formatted_total_volume_24h + ".")
print()
print("BTC makes up " + str(btc_dominance) + "% of the global market cap. ETH makes up " + str(eth_dominance) + "% of the global market cap.")
