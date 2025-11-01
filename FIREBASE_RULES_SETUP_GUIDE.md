# Guia Completo: Configurar Regras do Firebase

## Problema
Você está recebendo o erro: **"Missing or insufficient permissions"** porque as regras do Firestore não estão permitindo acesso à coleção `invites`.

## Solução Passo a Passo

### 1. Acesse o Firebase Console
1. Vá para: https://console.firebase.google.com
2. Selecione seu projeto **Achadinhos Xpress**
3. No menu lateral, clique em **Firestore Database**
4. Clique na aba **Rules** (Regras)

### 2. Copie as Regras Atualizadas

Apague TODAS as regras existentes e cole estas novas regras:

\`\`\`javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Função para verificar se o usuário é admin
    function isAdmin() {
      return request.auth != null &&
             exists(/databases/$(database)/documents/invites/$(request.auth.token.email)) &&
             (get(/databases/$(database)/documents/invites/$(request.auth.token.email)).data.role == 'ADM Master' ||
              get(/databases/$(database)/documents/invites/$(request.auth.token.email)).data.role == 'admin');
    }

    // Produtos: leitura pública, escrita só admin
    match /products/{productId} {
      allow read: if true;
      allow write: if isAdmin();
    }

    // Meta (configurações públicas como contato): leitura pública, escrita só admin
    match /meta/{document} {
      allow read: if true;
      allow write: if isAdmin();
    }

    // Config (configurações internas): apenas admin
    match /config/{document} {
      allow read, write: if isAdmin();
    }

    // Invites: usuário autenticado pode ler seu próprio convite, admin pode tudo
    match /invites/{email} {
      allow read: if request.auth != null && request.auth.token.email == email;
      allow write: if isAdmin();
    }

    // Users: usuário pode ler/escrever seus próprios dados
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Orders: usuário pode ler seus próprios pedidos, admin pode tudo
    match /orders/{orderId} {
      allow read: if request.auth != null && 
                     (resource.data.userId == request.auth.uid || isAdmin());
      allow write: if request.auth != null;
    }

    // Cart: usuário pode gerenciar seu próprio carrinho
    match /cart/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
\`\`\`

### 3. Publique as Regras
1. Clique no botão **"Publicar"** (Publish) no topo da página
2. Aguarde a confirmação de que as regras foram publicadas

### 4. Verifique o Documento de Admin
1. Ainda no Firestore Database, clique na aba **Data**
2. Navegue até a coleção **invites**
3. Verifique se existe um documento com ID: **pheliprhuan15@gmail.com**
4. Confirme que o campo **role** está como: **"ADM Master"**

### 5. Teste o Acesso
1. Faça **logout** do site
2. Limpe o cache do navegador (Ctrl+Shift+Delete)
3. Faça **login** novamente com: pheliprhuan15@gmail.com
4. Tente acessar o Dashboard

## O Que Mudou nas Regras?

### Antes (ERRADO):
\`\`\`javascript
match /invites/{email} {
  allow read, write: if isAdmin();
}
\`\`\`
**Problema:** Usuário não consegue ler seu próprio convite para verificar se é admin. Isso cria um loop: precisa ser admin para ler, mas precisa ler para saber se é admin!

### Depois (CORRETO):
\`\`\`javascript
match /invites/{email} {
  allow read: if request.auth != null && request.auth.token.email == email;
  allow write: if isAdmin();
}
\`\`\`
**Solução:** Qualquer usuário autenticado pode ler SEU PRÓPRIO convite, mas só admin pode criar/editar convites.

## Verificação de Sucesso

Após seguir todos os passos, você deve:
- ✅ Conseguir fazer login sem erros de permissão
- ✅ Ver "ADM Master" no canto superior direito do dashboard
- ✅ Conseguir editar produtos e configurações
- ✅ Conseguir alterar informações de contato

## Ainda com Problemas?

Se ainda estiver com erro de permissão:

1. **Verifique o console do navegador** (F12) e procure por mensagens com `[v0]`
2. **Confirme que o email está correto** no documento do Firestore
3. **Tente criar um novo documento** na coleção invites com seu email
4. **Aguarde 1-2 minutos** após publicar as regras (pode haver delay)

## Contato para Suporte

Se nada funcionar, tire um print do:
1. Console do navegador (F12 > Console)
2. Documento na coleção invites
3. Regras publicadas no Firebase

E me envie para análise.
