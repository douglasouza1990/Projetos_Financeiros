"""Reporting utilities for personal finance analysis."""
from __future__ import annotations

from typing import Literal

import pandas as pd


def add_period_columns(df: pd.DataFrame, *, period: Literal["M", "Y"] = "M") -> pd.DataFrame:
    """Add period helpers to the transactions dataframe."""
    enriched = df.copy()
    enriched["ano"] = enriched["data"].dt.year
    enriched["mes"] = enriched["data"].dt.month
    enriched["periodo"] = enriched["data"].dt.to_period(period)
    return enriched


def summarize_by_category(df: pd.DataFrame) -> pd.DataFrame:
    """Aggregate totals by category and subcategory."""
    summary = (
        df.groupby(["categoria", "subcategoria"], dropna=False)["valor"]
        .sum()
        .reset_index(name="total")
        .sort_values(["categoria", "subcategoria"])
    )
    return summary


def summarize_by_period(df: pd.DataFrame, *, period: Literal["M", "Y"] = "M") -> pd.DataFrame:
    """Aggregate totals by period and categories."""
    enriched = add_period_columns(df, period=period)
    summary = (
        enriched.groupby(["periodo", "categoria", "subcategoria"], dropna=False)["valor"]
        .sum()
        .reset_index(name="total")
        .sort_values(["periodo", "categoria", "subcategoria"])
    )
    return summary
