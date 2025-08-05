# Planejador de Aposentadoria

Aplicação React para planejamento de aposentadoria com análise de incertezas e projeções financeiras.

## 🚀 Como Publicar o Site

### Opção 1: GitHub Pages (Recomendado)

1. **Crie um repositório no GitHub:**
   - Vá para [github.com](https://github.com)
   - Clique em "New repository"
   - Dê um nome ao projeto (ex: "planejador-aposentadoria")

2. **Faça upload do código:**
   ```bash
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/SEU_USUARIO/planejador-aposentadoria.git
   git push -u origin main
   ```

3. **Configure GitHub Pages:**
   - Vá para Settings > Pages
   - Source: "GitHub Actions"
   - O site será publicado automaticamente em: `https://SEU_USUARIO.github.io/planejador-aposentadoria`

### Opção 2: Netlify (Alternativa)

1. **Acesse [netlify.com](https://netlify.com)**
2. **Faça login com GitHub**
3. **Clique em "New site from Git"**
4. **Selecione seu repositório**
5. **Build settings:**
   - Build command: `npm run build`
   - Publish directory: `dist`
6. **Clique em "Deploy site"**

### Opção 3: Vercel (Alternativa)

1. **Acesse [vercel.com](https://vercel.com)**
2. **Faça login com GitHub**
3. **Clique em "New Project"**
4. **Importe seu repositório**
5. **Clique em "Deploy"**

## 🛠️ Desenvolvimento Local

```bash
# Instalar dependências
npm install

# Executar em modo desenvolvimento
npm run dev

# Build para produção
npm run build
```

## 📋 Funcionalidades

- ✅ Cálculo de projeções de aposentadoria
- ✅ Análise de incertezas (cenários otimista/pessimista)
- ✅ Formatação de moeda dinâmica
- ✅ Tabela de contribuições personalizadas
- ✅ Gráficos interativos
- ✅ Interface responsiva

## 🎯 Como Usar

1. **Preencha os dados atuais** (idade, valor inicial, etc.)
2. **Defina suas metas** (benefício desejado, aportes extras)
3. **Configure as incertezas** (variações percentuais)
4. **Visualize as projeções** no gráfico
5. **Analise os cenários** otimista e pessimista
