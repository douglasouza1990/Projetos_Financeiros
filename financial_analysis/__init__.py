"""Financial analysis toolkit for personal transactions."""
from .categorization import CategoryManager, CategoryRule, create_categories_from_mapping, ensure_subcategories
from .io import (
    DEFAULT_ALIASES,
    STANDARD_COLUMNS,
    REQUIRED_COLUMNS,
    ValidationResult,
    export_reports,
    list_unique_descriptions,
    read_excel_transactions,
    validate_transactions,
)
from .reporting import add_period_columns, summarize_by_category, summarize_by_period
from .utils import normalize_column_name

__all__ = [
    "CategoryManager",
    "CategoryRule",
    "create_categories_from_mapping",
    "ensure_subcategories",
    "DEFAULT_ALIASES",
    "STANDARD_COLUMNS",
    "REQUIRED_COLUMNS",
    "ValidationResult",
    "export_reports",
    "list_unique_descriptions",
    "read_excel_transactions",
    "validate_transactions",
    "add_period_columns",
    "summarize_by_category",
    "summarize_by_period",
    "normalize_column_name",
]
