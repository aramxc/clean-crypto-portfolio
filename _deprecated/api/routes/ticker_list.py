from flask import Blueprint, jsonify
from api.routes.utils import load_cached_data

ticker_list = Blueprint('ticker_list', __name__)

@ticker_list.route('/ticker-list', methods=['GET'])
def handle_ticker_list():
    cached_data = load_cached_data()
    tickers = [{'label': currency['symbol'], 'id': index} for index, currency in enumerate(cached_data['data'], start=1)]
    return jsonify(tickers)