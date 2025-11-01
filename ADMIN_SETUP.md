# Como Configurar o Primeiro Administrador

Para acessar o dashboard administrativo, você precisa adicionar seu email na coleção `invites` do Firestore.

## Opção 1: Usando o Console do Firebase (Recomendado)

1. Acesse o [Firebase Console](https://console.firebase.google.com/)
2. Selecione seu projeto
3. Vá em **Firestore Database**
4. Clique em **Iniciar coleção** (ou adicione um documento se a coleção já existir)
5. Nome da coleção: `invites`
6. ID do documento: **seu-email@gmail.com** (use o email exato que você usa para fazer login)
7. Adicione os seguintes campos:
   - `email` (string): seu-email@gmail.com
   - `role` (string): ADM Master
   - `createdAt` (timestamp): Data/hora atual
   - `createdBy` (string): system

8. Clique em **Salvar**
9. Faça logout e login novamente no site
10. Agora você terá acesso ao dashboard em `/dashboard`

## Opção 2: Usando o Script (Avançado)

Se você tiver acesso ao console do navegador:

1. Faça login no site
2. Abra o console do navegador (F12)
3. Cole e execute o seguinte código:

\`\`\`javascript
import { initializeFirstAdmin } from '@/lib/firebase/init-admin'
await initializeFirstAdmin('seu-email@gmail.com')
\`\`\`

4. Faça logout e login novamente

## Verificando se Funcionou

Após adicionar seu email como admin:

1. Faça logout do site
2. Faça login novamente com o email que você adicionou
3. Você deverá ver o link "Dashboard" no menu do usuário
4. Ao acessar `/dashboard`, você terá acesso completo às configurações

## Adicionando Mais Administradores

Depois que você tiver acesso ao dashboard:

1. Acesse o dashboard
2. Vá na aba **Administradores**
3. Adicione novos administradores através da interface

## Troubleshooting

Se ainda não conseguir acessar:

1. Verifique se o email no Firestore é EXATAMENTE o mesmo do login
2. Verifique se o campo `role` está como "ADM Master" (com maiúsculas)
3. Limpe o cache do navegador e faça logout/login novamente
4. Verifique as regras de segurança do Firestore (devem permitir leitura da coleção `invites`)
