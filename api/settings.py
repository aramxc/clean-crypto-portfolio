from dotenv import load_dotenv
import os

load_dotenv()


def get_api_key(api_key):
    return os.getenv(api_key)
