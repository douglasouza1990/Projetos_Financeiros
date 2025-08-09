# 🏷️ Sistema de Versionamento Automático

## 📋 **Como Funciona**

O sistema gera automaticamente uma nova versão **a cada build**, sem necessidade de intervenção manual.

### **Formato da Versão**
```
v{YYYYMMDD-HHMM}.{BUILD_NUMBER}
```

**Exemplo:** `v20250808-2235.3312`
- **Data:** 08/08/2025
- **Hora:** 22:35  
- **Build:** #3312

## 🔄 **Quando a Versão é Atualizada**

✅ **Automaticamente** a cada:
- `npm run build`
- Deploy no Netlify
- Build em ambiente de produção

✅ **Não requer**:
- Edição manual de arquivos
- Commits específicos
- Configuração adicional

## 🎯 **Visualização da Versão**

### **No Sistema**
- **Localização:** Canto inferior direito
- **Estado:** Discreto (opacidade 60%)
- **Hover:** Exibe detalhes do deploy
- **Informações:** Data, hora e número do build

### **No Console de Build**
```bash
🚀 Generating version: v20250808-2235.3312
```

## ⚙️ **Arquivos Envolvidos**

### **`vite.config.ts`**
- Plugin personalizado `versionPlugin()`
- Gera versão baseada em timestamp + build number
- Injeta como variável global `__APP_VERSION__`

### **`src/types/env.d.ts`**
- Declaração TypeScript para `__APP_VERSION__`
- Evita erros de compilação

### **`src/components/VersionInfo.tsx`**
- Componente que exibe a versão
- Mostra detalhes ao fazer hover
- Design discreto e responsivo

## 🚀 **Benefícios**

✅ **Rastreabilidade completa** de cada deploy
✅ **Zero manutenção** - totalmente automático  
✅ **Identificação única** de cada versão
✅ **Informações úteis** para debugging
✅ **Experiência profissional** para usuários

## 🔧 **Customização**

Para alterar o formato da versão, edite a função no `vite.config.ts`:

```typescript
const version = `v${timestamp}.${buildNumber}`;
```

**Exemplos de formatos alternativos:**
- `v1.2.${buildNumber}` - Versionamento semântico
- `build-${buildNumber}` - Apenas número do build
- `${timestamp}` - Apenas timestamp

## 📈 **Monitoramento**

Cada deploy gera uma versão única que permite:
- Identificar quando uma funcionalidade foi ao ar
- Rastrear problemas específicos de versão
- Comparar diferentes deploys
- Facilitar rollbacks se necessário
