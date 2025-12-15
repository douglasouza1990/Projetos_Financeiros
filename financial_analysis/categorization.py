"""Categorization helpers for financial transactions."""
from __future__ import annotations

from dataclasses import dataclass, field
from typing import Dict, Iterable, List

import pandas as pd


@dataclass
class CategoryRule:
    """Represents a category/subcategory pair with optional keywords."""

    category: str
    subcategory: str
    keywords: List[str] = field(default_factory=list)

    def matches_description(self, description: str) -> bool:
        searchable = description.lower()
        return any(keyword.lower() in searchable for keyword in self.keywords)


class CategoryManager:
    """Maintains known categories and applies categorization rules."""

    def __init__(self) -> None:
        self.manual_rules: Dict[str, CategoryRule] = {}
        self.keyword_rules: List[CategoryRule] = []

    def add_manual_rule(self, description: str, category: str, subcategory: str) -> None:
        key = description.strip().lower()
        self.manual_rules[key] = CategoryRule(category=category, subcategory=subcategory)

    def add_keyword_rule(self, category: str, subcategory: str, keywords: Iterable[str]) -> None:
        self.keyword_rules.append(
            CategoryRule(category=category, subcategory=subcategory, keywords=list(keywords))
        )

    def categorize_row(self, description: str) -> CategoryRule:
        normalized = description.strip().lower()
        if normalized in self.manual_rules:
            return self.manual_rules[normalized]
        for rule in self.keyword_rules:
            if rule.matches_description(normalized):
                return rule
        return CategoryRule(category="Não categorizado", subcategory="Não categorizado")

    def categorize(self, df: pd.DataFrame) -> pd.DataFrame:
        categorized = df.copy()
        categories = [self.categorize_row(desc) for desc in categorized["descricao"]]
        categorized["categoria"] = [rule.category for rule in categories]
        categorized["subcategoria"] = [rule.subcategory for rule in categories]
        return categorized


def create_categories_from_mapping(mapping: Dict[str, Dict[str, str]]) -> CategoryManager:
    """Build a CategoryManager from a mapping of description -> category/subcategory."""
    manager = CategoryManager()
    for description, payload in mapping.items():
        manager.add_manual_rule(
            description=description,
            category=payload.get("categoria") or payload.get("category") or "",
            subcategory=payload.get("subcategoria") or payload.get("subcategory") or "",
        )
    return manager


def ensure_subcategories(manager: CategoryManager, subcategories: Iterable[CategoryRule]) -> None:
    """Register keyword-based rules in the manager."""
    for rule in subcategories:
        manager.add_keyword_rule(rule.category, rule.subcategory, rule.keywords)
