# Guia de Configuração do Firestore

## Problema: "Could not reach Cloud Firestore backend"

Este erro significa que o banco de dados Firestore não está configurado ou acessível. Siga os passos abaixo:

## Passo 1: Criar o Banco de Dados Firestore

1. Acesse o Firebase Console: https://console.firebase.google.com/project/achadinhos-xpress/firestore

2. Se você ver "Cloud Firestore" sem nenhum banco criado, clique em **"Criar banco de dados"**

3. Escolha o modo de inicialização:
   - **Modo de produção** (recomendado): Usa as regras de segurança que você configurou
   - **Modo de teste**: Permite acesso público por 30 dias (NÃO recomendado para produção)

4. Escolha a localização do banco de dados:
   - Recomendado para Brasil: **southamerica-east1 (São Paulo)**
   - Ou: **us-central1** (padrão)

5. Clique em **"Ativar"** e aguarde a criação do banco (pode levar alguns minutos)

## Passo 2: Verificar as Regras de Segurança

Depois de criar o banco, vá em **Firestore Database > Regras** e cole as regras do arquivo `firebase-security-rules-complete.txt`

## Passo 3: Criar as Coleções Iniciais

Após criar o banco, você precisa criar as coleções manualmente:

### 3.1 Criar coleção "meta"
1. No Firestore, clique em **"Iniciar coleção"**
2. ID da coleção: `meta`
3. ID do documento: `config`
4. Adicione os campos:
   - `contactEmail` (string): "contato@achadinhosxpress.com"
   - `contactPhone` (string): "+55 (11) 9999-9999"
   - `contactAddress` (string): "São Paulo, SP - Brasil"
   - `businessHours` (map):
     - `weekdays` (string): "9:00 - 18:00"
     - `saturday` (string): "9:00 - 13:00"
     - `sunday` (string): "Fechado"

### 3.2 Verificar coleção "invites"
Certifique-se de que existe o documento com seu email:
- Coleção: `invites`
- Documento: `pheliprhuan15@gmail.com`
- Campos:
  - `email` (string): "pheliprhuan15@gmail.com"
  - `role` (string): "ADM Master"
  - `createdBy` (string): "system"
  - `createdAt` (timestamp): data atual

## Passo 4: Testar a Conexão

1. Faça logout do site
2. Limpe o cache do navegador (Ctrl+Shift+Delete)
3. Faça login novamente
4. Abra o Console do navegador (F12)
5. Procure por mensagens `[v0]` que indicam o status da conexão

## Solução de Problemas

### Erro persiste após criar o banco?
- Aguarde 2-3 minutos para propagação
- Limpe o cache do navegador
- Tente em uma aba anônima

### "Missing or insufficient permissions"?
- Verifique se as regras de segurança foram aplicadas corretamente
- Certifique-se de que seu email está na coleção `invites` com role "ADM Master"

### Banco de dados não aparece?
- Verifique se você está no projeto correto: `achadinhos-xpress`
- Tente acessar diretamente: https://console.firebase.google.com/project/achadinhos-xpress/firestore
