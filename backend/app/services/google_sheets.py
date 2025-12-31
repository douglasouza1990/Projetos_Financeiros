import json
from typing import List

from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from google.oauth2.service_account import Credentials


class GoogleSheetsClient:
    def __init__(self, service_account_json: str) -> None:
        payload = json.loads(service_account_json)
        self._credentials = Credentials.from_service_account_info(
            payload,
            scopes=["https://www.googleapis.com/auth/spreadsheets.readonly"],
        )

    def fetch_sheet_values(self, spreadsheet_id: str, sheet_name: str) -> List[List[str]]:
        try:
            service = build("sheets", "v4", credentials=self._credentials, cache_discovery=False)
            result = (
                service.spreadsheets()
                .values()
                .get(spreadsheetId=spreadsheet_id, range=sheet_name)
                .execute()
            )
            return result.get("values", [])
        except HttpError as exc:
            raise GoogleSheetsError("Google Sheets API error.") from exc
        except Exception as exc:
            raise GoogleSheetsError("Unexpected error when contacting Google Sheets.") from exc


class GoogleSheetsError(RuntimeError):
    """Wraps Google Sheets API errors for service layer."""

