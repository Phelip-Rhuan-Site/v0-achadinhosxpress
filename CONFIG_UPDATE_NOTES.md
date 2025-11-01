# Notas sobre Atualizações de Configuração

## Problemas Identificados e Soluções

### 1. Email de Contato Não Atualiza
**Problema:** A página de contato estava buscando `data.contact.email` mas o config salva como `data.contactEmail`

**Solução:** Atualizado o código para ler os campos corretos: `contactEmail`, `contactPhone`, `contactAddress`, `businessHours`

### 2. Favicon Não Atualiza
**Problema:** O favicon é definido no `layout.tsx` que é um Server Component e só é executado no build/reload da página

**Limitação:** Next.js não permite atualizar o favicon dinamicamente sem recarregar a página. O favicon configurado só aparecerá após:
- Fazer deploy novamente
- Recarregar a página completamente (Ctrl+F5)
- Limpar o cache do navegador

**Alternativa:** Para favicon dinâmico, seria necessário usar um script client-side que manipula o DOM, mas isso não é a melhor prática.

### 3. Nome do Site Não Aparece ao Lado da Logo
**Problema:** O código mostrava APENAS a logo quando `logoUrl` estava definida

**Solução:** Atualizado para mostrar logo E nome do site juntos quando a logo está configurada

## Como Testar

1. Salve as configurações no dashboard
2. Para ver o email atualizado: recarregue a página de contato
3. Para ver a logo e nome: recarregue a página inicial
4. Para ver o favicon: faça deploy novamente ou limpe o cache (Ctrl+Shift+Delete)

## Estrutura de Dados no Firestore

\`\`\`javascript
// Documento: meta/config
{
  logoUrl: "data:image/png;base64,...",
  faviconUrl: "data:image/png;base64,...",
  contactEmail: "contato@achadinhos.com.br",
  contactPhone: "+55 (11) 9999-9999",
  contactAddress: "São Paulo, SP - Brasil",
  businessHours: {
    weekdays: "9:00 - 18:00",
    saturday: "9:00 - 13:00",
    sunday: "Fechado"
  },
  socialMedia: {
    instagram: "...",
    whatsappChannel: "...",
    // etc
  }
}
