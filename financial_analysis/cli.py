"""CLI to run personal finance analysis from an Excel file."""
from __future__ import annotations

import argparse
import json
from pathlib import Path
from typing import Dict, Iterable

from .categorization import CategoryManager, create_categories_from_mapping
from .io import (
    ValidationResult,
    export_reports,
    list_unique_descriptions,
    read_excel_transactions,
    validate_transactions,
)
from .reporting import add_period_columns, summarize_by_category, summarize_by_period


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Analise financeira pessoal a partir de Excel")
    parser.add_argument("input", type=Path, help="Caminho do arquivo Excel de entrada")
    parser.add_argument(
        "--output",
        type=Path,
        default=Path("relatorio_financeiro.xlsx"),
        help="Caminho do Excel final com transacoes e resumos",
    )
    parser.add_argument(
        "--mapping",
        type=Path,
        help=(
            "Arquivo JSON com regras de categorizacao. Pode conter chaves 'manual'"
            " (descricao -> {categoria, subcategoria}) e 'keywords'"
            " (lista de objetos com categoria, subcategoria e lista keywords)."
        ),
    )
    parser.add_argument(
        "--period",
        choices=["M", "Y"],
        default="M",
        help="Periodicidade para agregacao por periodo (M=mensal, Y=anual)",
    )
    return parser.parse_args()


def load_rules_from_file(path: Path) -> CategoryManager:
    """Create a CategoryManager using a JSON rules file."""
    with path.open("r", encoding="utf-8") as handle:
        data = json.load(handle)

    manual_mapping: Dict[str, Dict[str, str]]
    keyword_rules: Iterable[Dict[str, Iterable[str]]]

    if "manual" in data or "keywords" in data:
        manual_mapping = data.get("manual", {})
        keyword_rules = data.get("keywords", [])
    else:
        manual_mapping = data
        keyword_rules = []

    manager = create_categories_from_mapping(manual_mapping)
    for rule in keyword_rules:
        manager.add_keyword_rule(
            rule.get("categoria") or rule.get("category") or "",
            rule.get("subcategoria") or rule.get("subcategory") or "",
            rule.get("keywords", []),
        )
    return manager


def build_manager(mapping_path: Path | None) -> CategoryManager:
    if mapping_path is None:
        return CategoryManager()
    if not mapping_path.exists():
        raise FileNotFoundError(f"Arquivo de mapeamento nao encontrado: {mapping_path}")
    return load_rules_from_file(mapping_path)


def run_pipeline(args: argparse.Namespace) -> None:
    df_raw = read_excel_transactions(args.input)
    validation: ValidationResult = validate_transactions(df_raw)

    print("Descricoes unicas encontradas:")
    for desc in list_unique_descriptions(validation.valid_rows):
        print(f"- {desc}")

    manager = build_manager(args.mapping)
    categorized = manager.categorize(validation.valid_rows)
    categorized = add_period_columns(categorized, period=args.period)

    summary = summarize_by_category(categorized)
    period_summary = summarize_by_period(categorized, period=args.period)

    print("\nTransacoes categorizadas:")
    print(categorized.to_string(index=False))

    print("\nResumo por categoria e subcategoria:")
    print(summary.to_string(index=False))

    output_path = export_reports(
        transactions=categorized,
        summary=summary,
        period_summary=period_summary,
        invalid_rows=validation.invalid_rows,
        output_path=args.output,
    )
    print(f"\nPlanilhas exportadas para: {output_path}")
    if not validation.invalid_rows.empty:
        print("Linhas invalidadas foram adicionadas na aba 'invalidas'.")


def main() -> None:
    args = parse_args()
    run_pipeline(args)


if __name__ == "__main__":
    main()
