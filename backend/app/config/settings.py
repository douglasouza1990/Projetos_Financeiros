import json
import os
from dataclasses import dataclass


@dataclass(frozen=True)
class Settings:
    spreadsheet_id: str
    sheet_name: str
    service_account_json: str


    @staticmethod
    def from_env() -> "Settings":
        spreadsheet_id = os.getenv("GOOGLE_SHEETS_SPREADSHEET_ID")
        sheet_name = os.getenv("GOOGLE_SHEETS_SHEET_NAME", "Base")
        service_account_json = os.getenv("GOOGLE_SERVICE_ACCOUNT_JSON")
        service_account_file = os.getenv("GOOGLE_SERVICE_ACCOUNT_FILE")

        if not spreadsheet_id:
            raise ValueError("Missing GOOGLE_SHEETS_SPREADSHEET_ID environment variable.")

        if service_account_json:
            try:
                json.loads(service_account_json)
            except json.JSONDecodeError as exc:
                raise ValueError("GOOGLE_SERVICE_ACCOUNT_JSON must be valid JSON.") from exc
            service_account_payload = service_account_json
        elif service_account_file:
            if not os.path.exists(service_account_file):
                raise ValueError("GOOGLE_SERVICE_ACCOUNT_FILE does not exist.")
            with open(service_account_file, "r", encoding="utf-8") as handle:
                service_account_payload = handle.read()
        else:
            raise ValueError(
                "Provide GOOGLE_SERVICE_ACCOUNT_JSON or GOOGLE_SERVICE_ACCOUNT_FILE environment variable."
            )

        return Settings(
            spreadsheet_id=spreadsheet_id,
            sheet_name=sheet_name,
            service_account_json=service_account_payload,
        )

