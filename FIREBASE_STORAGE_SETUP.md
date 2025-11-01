# Configuração do Firebase Storage

O erro de CORS que você está vendo acontece porque o Firebase Storage precisa ser configurado para aceitar uploads do seu domínio.

## Passo 1: Ativar Firebase Storage

1. Vá para o [Firebase Console](https://console.firebase.google.com/)
2. Selecione seu projeto: **achadinhos-xpress**
3. No menu lateral, clique em **Storage**
4. Se ainda não estiver ativado, clique em **Get Started** e siga as instruções

## Passo 2: Configurar Regras de Segurança do Storage

1. No Firebase Storage, clique na aba **Rules**
2. Cole as seguintes regras:

\`\`\`
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Permitir leitura pública de todos os arquivos
    match /{allPaths=**} {
      allow read: if true;
    }
    
    // Permitir upload apenas para admins na pasta config
    match /config/{fileName} {
      allow write: if request.auth != null;
    }
    
    // Permitir upload de produtos apenas para admins
    match /products/{fileName} {
      allow write: if request.auth != null;
    }
  }
}
\`\`\`

3. Clique em **Publish** para salvar as regras

## Passo 3: Configurar CORS (Opcional)

Se o erro persistir, você pode precisar configurar CORS manualmente usando o Google Cloud Console:

1. Instale o [Google Cloud SDK](https://cloud.google.com/sdk/docs/install)
2. Crie um arquivo `cors.json` com o seguinte conteúdo:

\`\`\`json
[
  {
    "origin": ["https://achadinhosxpress.netlify.app", "http://localhost:3000"],
    "method": ["GET", "POST", "PUT", "DELETE"],
    "maxAgeSeconds": 3600
  }
]
\`\`\`

3. Execute o comando:
\`\`\`bash
gsutil cors set cors.json gs://achadinhos-xpress.firebasestorage.app
\`\`\`

## Solução Temporária

Por enquanto, o código foi atualizado para salvar as configurações mesmo se o upload da logo falhar. Você pode:

1. Salvar as configurações sem logo (funcionará normalmente)
2. Configurar o Firebase Storage seguindo os passos acima
3. Depois fazer upload da logo novamente

## Testando

Após configurar o Storage:
1. Faça logout e login novamente no site
2. Tente fazer upload de uma logo
3. O upload deve funcionar sem erros de CORS
