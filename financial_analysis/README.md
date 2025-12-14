# Ferramentas de Análise Financeira Pessoal

Módulos em Python para processar planilhas de transações pessoais usando pandas.

## Pré-requisitos

```bash
pip install -r requirements.txt
```

## Como usar a CLI

```bash
python -m financial_analysis.cli caminho/para/transacoes.xlsx \
  --mapping caminho/para/regras.json \
  --output saida/relatorio_financeiro.xlsx \
  --period M
```

- `--mapping` é opcional e aceita um JSON com regras manuais e por palavra-chave.
- `--period` aceita `M` (mensal) ou `Y` (anual) para os agrupamentos por período.

### Exemplo de arquivo de regras (JSON)

```json
{
  "manual": {
    "SUPERMERCADO ABC": {"categoria": "Casa", "subcategoria": "Mercado"},
    "ACADEMIA": {"categoria": "Saude", "subcategoria": "Academia"}
  },
  "keywords": [
    {"categoria": "Transporte", "subcategoria": "Combustivel", "keywords": ["posto", "gasolina"]}
  ]
}
```

### Fluxo executado

1. Leitura do Excel e normalização das colunas (`data`, `descricao`, `valor`).
2. Validação dos dados (datas/valores válidos, remoção de linhas inválidas).
3. Listagem de descrições únicas para facilitar categorização manual.
4. Categorização manual e por palavras-chave (pronto para automação futura).
5. Enriquecimento com colunas de período (mês/ano).
6. Geração das tabelas de transações categorizadas e resumo por categoria/subcategoria.
7. Exportação para um Excel com abas `transacoes`, `resumo`, `por_periodo` e `invalidas` (quando aplicável).
