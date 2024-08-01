import os
import csv
import json
import requests
from prettytable import PrettyTable
from colorama import Fore, Back, Style
from settings import get_api_key

LOCAL_CURRENCY = 'USD'  # pass in different currencies here
CURRENCY_SYMBOL = '$'

API_KEY = get_api_key("API_KEY")

HEADERS = {'X-CMC_PRO_API_KEY': API_KEY}
BASE_URL = 'https://pro-api.coinmarketcap.com'

print()
print("My Portfolio:")
print()

portfolio_value = 0.00

table = PrettyTable(['Asset', 'Amount Owned', 'Value', 'Price', '1H', '24H', '7D'])

with open("../my_portfolio.csv", "r") as csv_file:
    csv_reader = csv.reader(csv_file)
    for line in csv_reader:
        # Remove hidden character commonly in CSVs on Mac
        if '\ufeff' in line[0]:
            line[0] = line[0][1:].upper()
        else:
            line[0] = line[0].upper()

        symbol = line[0]
        amount = line[1]

        quote_url = BASE_URL + '/v1/cryptocurrency/quotes/latest?convert=' + LOCAL_CURRENCY + '&symbol=' + symbol

        request = requests.get(quote_url, headers=HEADERS)
        results = request.json()

        if 'data' in results and symbol in results['data']:
            currency = results['data'][symbol]
            name = currency['name']
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

            if one_hour_change > 0:
                one_hour_change = Back.GREEN + str(one_hour_change) + '%' + Style.RESET_ALL
            else:
                one_hour_change = Back.RED + str(one_hour_change) + '%' + Style.RESET_ALL

            if day_change > 0:
                day_change = Back.GREEN + str(day_change) + '%' + Style.RESET_ALL
            else:
                day_change = Back.RED + str(day_change) + '%' + Style.RESET_ALL
            
            if week_change > 0:
                week_change = Back.GREEN + str(week_change) + '%' + Style.RESET_ALL
            else:
                week_change = Back.RED + str(week_change) + '%' + Style.RESET_ALL

            table.add_row([
                name + ' (' + symbol + ')',
                amount,
                CURRENCY_SYMBOL + formatted_value,
                CURRENCY_SYMBOL + formatted_price,
                one_hour_change,
                day_change,
                week_change
            ])
        else:
            print(f"Error: No data found for symbol '{symbol}'.")

print(table)
print()
print("Total Value: " + CURRENCY_SYMBOL + formatted_portfolio_value)
print()