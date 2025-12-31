from typing import Any, Dict, List

from app.config.settings import Settings
from app.services.google_sheets import GoogleSheetsClient, GoogleSheetsError


class WorklogService:
    def __init__(self, sheets_client: GoogleSheetsClient, settings: Settings) -> None:
        self._sheets_client = sheets_client
        self._settings = settings

    def get_worklogs(self) -> List[Dict[str, Any]]:
        values = self._sheets_client.fetch_sheet_values(
            self._settings.spreadsheet_id,
            self._settings.sheet_name,
        )

        if not values:
            return []

        headers = [header.strip() for header in values[0]]
        rows = values[1:]

        worklogs = []
        for row in rows:
            if not any(cell.strip() if isinstance(cell, str) else cell for cell in row):
                continue
            item = {
                header: (row[index] if index < len(row) else None)
                for index, header in enumerate(headers)
            }
            worklogs.append(item)
        return worklogs


class WorklogServiceError(RuntimeError):
    """Raised when worklog service fails."""


class WorklogServiceFactory:
    @staticmethod
    def create() -> WorklogService:
        settings = Settings.from_env()
        client = GoogleSheetsClient(settings.service_account_json)
        return WorklogService(client, settings)
