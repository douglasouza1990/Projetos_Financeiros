"""Utility helpers for financial data processing."""
import unicodedata
from typing import Dict, Iterable


def normalize_column_name(name: str) -> str:
    """Normalize column names by removing accents and lower-casing."""
    normalized = unicodedata.normalize("NFKD", name)
    ascii_name = normalized.encode("ascii", "ignore").decode("ascii")
    return ascii_name.strip().lower()


def resolve_column_aliases(columns: Iterable[str], aliases: Dict[str, str]) -> Dict[str, str]:
    """Return a column rename map using aliases when present."""
    rename_map: Dict[str, str] = {}
    for original in columns:
        normalized = normalize_column_name(original)
        if normalized in aliases:
            rename_map[original] = aliases[normalized]
    return rename_map
