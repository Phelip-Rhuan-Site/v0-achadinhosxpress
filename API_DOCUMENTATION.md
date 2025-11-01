# API de Produtos - Achadinhos Xpress

API simples para robôs publicarem produtos na vitrine automaticamente.

## Autenticação

Todas as requisições devem incluir o header:

\`\`\`
Authorization: Bearer SUA_CHAVE_SECRETA
\`\`\`

Configure a chave secreta na variável de ambiente `API_SECRET_KEY`.

## Endpoints

### 1. Criar Produto

**POST** `/api/produtos`

\`\`\`json
{
  "sku": "TENIS123",
  "titulo": "Tênis Nike",
  "preco": 199.90,
  "afiliado_url": "https://loja.com/p?aff=123",
  "imagens": ["https://cdn.loja.com/tenis.jpg"],
  "status": "ativo"
}
\`\`\`

**Resposta de Sucesso (201):**
\`\`\`json
{
  "ok": true,
  "mensagem": "Produto criado"
}
\`\`\`

**Erros:**
- 400: Campos obrigatórios faltando
- 401: Token inválido
- 409: SKU já existe

---

### 2. Atualizar Produto

**PUT** `/api/produtos/TENIS123`

\`\`\`json
{
  "preco": 179.90,
  "status": "ativo"
}
\`\`\`

**Resposta de Sucesso (200):**
\`\`\`json
{
  "ok": true,
  "mensagem": "Produto atualizado"
}
\`\`\`

**Erros:**
- 401: Token inválido
- 404: Produto não encontrado

---

### 3. Consultar Produto

**GET** `/api/produtos?sku=TENIS123`

**Resposta se existe:**
\`\`\`json
{
  "existe": true,
  "preco": 199.90,
  "status": "ativo"
}
\`\`\`

**Resposta se não existe:**
\`\`\`json
{
  "existe": false
}
\`\`\`

---

### 4. Bloquear Produto

**POST** `/api/produtos/bloquear`

\`\`\`json
{
  "sku": "TENIS123"
}
\`\`\`

**Resposta de Sucesso (200):**
\`\`\`json
{
  "ok": true,
  "mensagem": "Produto bloqueado"
}
\`\`\`

---

## Configuração

1. Adicione a variável de ambiente no Vercel/Netlify:
   \`\`\`
   API_SECRET_KEY=sua_chave_secreta_aqui
   \`\`\`

2. Use essa mesma chave no header Authorization do seu bot:
   \`\`\`
   Authorization: Bearer sua_chave_secreta_aqui
   \`\`\`

## Mapeamento de Campos

| Campo Bot | Campo Interno | Descrição |
|-----------|---------------|-----------|
| sku | sku | Identificador único |
| titulo | name | Nome do produto |
| preco | price | Preço em reais |
| afiliado_url | url | Link de afiliado |
| imagens | images | Array de URLs |
| status | active/published | "ativo" ou "inativo" |

## Exemplos de Uso

### Python
\`\`\`python
import requests

headers = {
    "Authorization": "Bearer SUA_CHAVE_SECRETA",
    "Content-Type": "application/json"
}

data = {
    "sku": "TENIS123",
    "titulo": "Tênis Nike",
    "preco": 199.90,
    "afiliado_url": "https://loja.com/p?aff=123",
    "imagens": ["https://cdn.loja.com/tenis.jpg"],
    "status": "ativo"
}

response = requests.post(
    "https://seusite.com/api/produtos",
    json=data,
    headers=headers
)

print(response.json())
\`\`\`

### cURL
\`\`\`bash
curl -X POST https://seusite.com/api/produtos \
  -H "Authorization: Bearer SUA_CHAVE_SECRETA" \
  -H "Content-Type: application/json" \
  -d '{
    "sku": "TENIS123",
    "titulo": "Tênis Nike",
    "preco": 199.90,
    "afiliado_url": "https://loja.com/p?aff=123",
    "imagens": ["https://cdn.loja.com/tenis.jpg"],
    "status": "ativo"
  }'
