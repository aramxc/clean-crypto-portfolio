import logging
from flask import Flask

from api.routes.portfolio import portfolio
from api.routes.ticker_list import ticker_list

log = logging.getLogger(__name__)


HTTP_SUCCESS = 200
HTTP_CREATED = 201
HTTP_DELETED = 204
HTTP_BAD_REQ = 400
HTTP_NOT_FOUND = 404


app = Flask(__name__)

API_BASE = "/api"

if __name__ == '__main__':
    app.run(host="localhost", port=8080, debug=True)