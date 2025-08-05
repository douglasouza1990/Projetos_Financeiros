# Validação dos Cálculos de Limite Inferior e Superior

## Problemas Identificados e Corrigidos

### 1. **Cálculo Incorreto dos Limites**
**Problema**: O código estava usando valores fixos (0.8 e 1.2) em vez dos valores calculados dinamicamente baseados nas incertezas.

**Solução**: 
- Agora os limites são calculados usando os arrays `pessimisticValues` e `optimisticValues`
- Cada cenário aplica as incertezas configuradas pelo usuário

### 2. **Inconsistência na Aplicação das Incertezas**
**Problema**: As incertezas não estavam sendo aplicadas corretamente em todos os parâmetros.

**Solução**:
- Incerteza do Aporte Anual: `annualContribution * (1 ± uncertaintyData.annualContribution / 100)`
- Incerteza da Rentabilidade: `returnRate * (1 ± uncertaintyData.returnRate / 100)`
- Incerteza da Renda Extra: `extraMonthlyIncome * (1 ± uncertaintyData.extraIncome / 100)`
- Incerteza do Benefício Mensal: `monthlyBenefit * (1 ± uncertaintyData.monthlyBenefit / 100)`

### 3. **Falta de Validação dos Cálculos**
**Problema**: Não havia verificação se os limites faziam sentido matematicamente.

**Solução**:
- Adicionada função `validateLimits()` que verifica:
  - Se o limite inferior é menor que o valor base
  - Se o limite superior é maior que o valor base
  - Logs detalhados das diferenças percentuais

### 4. **Visualização Melhorada**
**Melhorias Implementadas**:
- Cores distintas para limites inferior (vermelho) e superior (verde)
- Linhas tracejadas para diferenciar dos valores base
- Legenda condicional que aparece apenas quando há incertezas
- Tabela expandida com colunas para os limites
- Área sombreada entre os limites no gráfico

## Como Testar as Validações

1. **Abrir o Console do Navegador** (F12)
2. **Configurar incertezas** no componente "Análise de Incertezas"
3. **Verificar os logs** que mostram:
   - Valor base
   - Limite inferior e superior
   - Diferenças percentuais
   - Avisos se os limites não fazem sentido

## Exemplo de Log de Validação

```javascript
Validação dos Limites: {
  valorBase: 1500000,
  limiteInferior: 1200000,
  limiteSuperior: 1800000,
  diferencaInferior: "-20.00%",
  diferencaSuperior: "+20.00%",
  incertezas: {
    annualContribution: 10,
    returnRate: 5,
    extraIncome: 15,
    monthlyBenefit: 10
  }
}
```

## Verificações Automáticas

O sistema agora verifica automaticamente:
- ✅ Limite inferior ≤ Valor base
- ✅ Limite superior ≥ Valor base
- ✅ Aplicação correta das incertezas configuradas
- ✅ Cálculos consistentes ao longo do tempo

## Cenários de Teste Recomendados

1. **Sem incertezas**: Todos os limites devem ser iguais ao valor base
2. **Incerteza baixa (5%)**: Diferenças pequenas nos limites
3. **Incerteza alta (20%)**: Diferenças significativas nos limites
4. **Múltiplas incertezas**: Efeito combinado de diferentes parâmetros
5. **Valores negativos**: Verificar se os limites funcionam corretamente 