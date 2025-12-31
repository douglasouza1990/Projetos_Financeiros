# Sistema de Worklogs com Google Sheets

Aplicação web completa (backend + frontend) que consome a guia **"Base"** de um Google Sheets como fonte de dados primária em modo somente leitura.

## ✅ Requisitos atendidos

- Leitura da guia "Base" via Google Sheets API oficial.
- Autenticação via Service Account (variáveis de ambiente).
- Colunas carregadas dinamicamente (sem hardcode).
- Backend com camadas separadas (config, services, controllers).
- Frontend com tabela dinâmica, paginação e filtros.

---

## 🔧 Configuração de credenciais do Google

1. Acesse o **Google Cloud Console** e crie um projeto.
2. Ative a **Google Sheets API**.
3. Crie uma **Service Account**.
4. Gere uma **chave JSON** para a Service Account.
5. Compartilhe a planilha com o e-mail da Service Account com permissão **visualizador**.

---

## ⚙️ Backend (FastAPI)

### 1) Variáveis de ambiente

Defina as variáveis abaixo (exemplo em `.env`):

```bash
GOOGLE_SHEETS_SPREADSHEET_ID=1b57oEuu4tzVrsuCYMHA3naGqHkKR_dKhQZqRVwHzMx4
GOOGLE_SHEETS_SHEET_NAME=Base
# Escolha UMA das opções abaixo:
GOOGLE_SERVICE_ACCOUNT_JSON='{"type": "service_account", ... }'
# ou
GOOGLE_SERVICE_ACCOUNT_FILE=/caminho/para/service-account.json
```

### 2) Instalação e execução

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt

uvicorn backend.app.main:app --reload
```

A API estará disponível em `http://localhost:8000`.

**Endpoint principal**

```
GET /worklogs
```

Retorna:

```json
{
  "data": [
    { "Coluna A": "valor", "Coluna B": "valor" }
  ]
}
```

---

## 💻 Frontend (React + Vite)

### 1) Variáveis de ambiente

Crie um arquivo `.env` na raiz com:

```bash
VITE_API_URL=http://localhost:8000
```

### 2) Instalação e execução

```bash
npm install
npm run dev
```

A interface estará disponível em `http://localhost:5173`.

---

## 🧪 Funcionalidades do Frontend

- Tabela dinâmica baseada nas colunas do Sheets
- Paginação
- Filtros automáticos (data, autor e projeto quando existirem)
- Busca textual global
- Estados de loading e erro

---

## 🗂️ Estrutura do projeto

```
backend/
  app/
    config/
    services/
    controllers/
    main.py
src/
  components/
  services/
```

---

## ⚠️ Observações

- O sistema **não grava** dados no Google Sheets.
- O acesso é estritamente somente leitura.
