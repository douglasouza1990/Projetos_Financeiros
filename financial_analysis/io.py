"""I/O helpers for reading and exporting financial spreadsheets."""
from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path
from typing import Dict, Iterable

import pandas as pd

from .utils import normalize_column_name, resolve_column_aliases


@dataclass
class ValidationResult:
    """Container for validated dataframes."""

    valid_rows: pd.DataFrame
    invalid_rows: pd.DataFrame


DEFAULT_ALIASES = {
    "data": "data",
    "dt": "data",
    "date": "data",
    "descricao": "descricao",
    "descrica": "descricao",
    "description": "descricao",
    "valor": "valor",
    "value": "valor",
    "amount": "valor",
}

STANDARD_COLUMNS = ["data", "descricao", "valor"]
REQUIRED_COLUMNS = set(STANDARD_COLUMNS)


def read_excel_transactions(path: Path | str, *, aliases: Dict[str, str] | None = None) -> pd.DataFrame:
    """Load transactions from an Excel file and standardize column names."""
    aliases = aliases or DEFAULT_ALIASES
    df = pd.read_excel(path)
    rename_map = resolve_column_aliases(df.columns.to_list(), aliases)
    df = df.rename(columns=rename_map)
    missing = REQUIRED_COLUMNS - set(df.columns)
    if missing:
        raise ValueError(f"Colunas obrigatorias ausentes: {', '.join(sorted(missing))}")
    standardized = df.loc[:, STANDARD_COLUMNS].copy()
    standardized.columns = [normalize_column_name(col) for col in standardized.columns]
    return standardized


def validate_transactions(df: pd.DataFrame) -> ValidationResult:
    """Validate and coerce transaction fields.

    - Converte datas usando ``pandas.to_datetime``.
    - Converte valores para numérico.
    - Remove linhas sem descrição.
    """
    working = df.copy()
    working["data"] = pd.to_datetime(working["data"], errors="coerce")
    working["descricao"] = working["descricao"].astype(str).str.strip()
    working["valor"] = pd.to_numeric(working["valor"], errors="coerce")

    invalid_mask = (
        working["data"].isna()
        | working["descricao"].eq("")
        | working["descricao"].isna()
        | working["valor"].isna()
    )
    invalid_rows = working.loc[invalid_mask].copy()
    valid_rows = working.loc[~invalid_mask].reset_index(drop=True)
    invalid_rows = invalid_rows.reset_index(drop=True)
    return ValidationResult(valid_rows=valid_rows, invalid_rows=invalid_rows)


def list_unique_descriptions(df: pd.DataFrame) -> Iterable[str]:
    """Return sorted unique descriptions for manual categorization."""
    return sorted(df["descricao"].dropna().astype(str).str.strip().unique())


def export_reports(
    transactions: pd.DataFrame,
    summary: pd.DataFrame,
    output_path: Path | str,
    *,
    invalid_rows: pd.DataFrame | None = None,
    period_summary: pd.DataFrame | None = None,
) -> Path:
    """Export curated data to an Excel workbook.

    Sheets:
    - ``transacoes``: linhas categorizadas e validadas.
    - ``resumo``: totais por categoria/subcategoria.
    - ``por_periodo``: agregados por periodo e categoria (opcional).
    - ``invalidas``: linhas removidas na validacao (opcional).
    """
    output_path = Path(output_path)
    output_path.parent.mkdir(parents=True, exist_ok=True)

    with pd.ExcelWriter(output_path) as writer:
        transactions.to_excel(writer, sheet_name="transacoes", index=False)
        summary.to_excel(writer, sheet_name="resumo", index=False)
        if period_summary is not None:
            period_summary.to_excel(writer, sheet_name="por_periodo", index=False)
        if invalid_rows is not None and not invalid_rows.empty:
            invalid_rows.to_excel(writer, sheet_name="invalidas", index=False)
    return output_path


def ensure_output_path(path: str | Path) -> Path:
    """Create parent directories for an output file path and return the path."""
    target = Path(path)
    target.parent.mkdir(parents=True, exist_ok=True)
    return target
