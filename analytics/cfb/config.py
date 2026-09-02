"""Paths and CFBD API key loading."""
import json
import os
from pathlib import Path

ANALYTICS_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = ANALYTICS_DIR / "data"
OUTPUT_DIR = ANALYTICS_DIR / "output"
MODEL_DIR = ANALYTICS_DIR / "models"

for _d in (DATA_DIR, OUTPUT_DIR, MODEL_DIR):
    _d.mkdir(exist_ok=True)


def get_api_key() -> str:
    """CFBD_API_KEY env var wins; falls back to secrets.json. Never print the key."""
    key = os.environ.get("CFBD_API_KEY")
    if key:
        return key
    secrets_path = ANALYTICS_DIR / "secrets.json"
    if secrets_path.exists():
        with open(secrets_path) as f:
            return json.load(f)["CFBD_API_KEY"]
    raise RuntimeError(
        "No CFBD API key found. Set the CFBD_API_KEY environment variable "
        "or create analytics/secrets.json with {\"CFBD_API_KEY\": \"...\"}."
    )
