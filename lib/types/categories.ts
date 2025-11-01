export interface CategoryField {
  name: string
  label: string
  type: "text" | "number" | "select" | "textarea"
  required: boolean
  options?: string[]
}

export interface Category {
  id: string
  name: string
  fields: CategoryField[]
}

// Universal fields for all categories
const universalFields: CategoryField[] = [
  { name: "sku", label: "SKU", type: "text", required: false },
  { name: "ean", label: "EAN/GTIN", type: "text", required: false },
  { name: "brand", label: "Marca", type: "text", required: true },
  { name: "weight", label: "Peso (kg)", type: "number", required: false },
  { name: "warranty", label: "Garantia", type: "text", required: false },
]

export const CATEGORIES: Category[] = [
  {
    id: "fashion",
    name: "Moda e Vestuário",
    fields: [
      ...universalFields,
      { name: "size", label: "Tamanho", type: "text", required: true },
      { name: "color", label: "Cor", type: "text", required: true },
      { name: "material", label: "Material Principal", type: "text", required: true },
      {
        name: "gender",
        label: "Gênero",
        type: "select",
        required: true,
        options: ["Feminino", "Masculino", "Unissex", "Infantil"],
      },
      { name: "fit", label: "Tipo de Corte/Modelagem", type: "text", required: false },
      { name: "occasion", label: "Ocasião/Estilo", type: "text", required: false },
    ],
  },
  {
    id: "footwear",
    name: "Calçados e Acessórios",
    fields: [
      ...universalFields,
      { name: "size", label: "Numeração", type: "text", required: true },
      { name: "heelHeight", label: "Altura do Salto/Cano", type: "text", required: false },
      { name: "upperMaterial", label: "Material do Cabedal", type: "text", required: true },
      { name: "soleMaterial", label: "Material do Solado", type: "text", required: false },
      { name: "closure", label: "Tipo de Fechamento", type: "text", required: false },
    ],
  },
  {
    id: "jewelry",
    name: "Joias e Relógios",
    fields: [
      ...universalFields,
      {
        name: "material",
        label: "Material",
        type: "select",
        required: true,
        options: ["Ouro", "Prata", "Aço Inoxidável", "Outro"],
      },
      { name: "stoneType", label: "Tipo de Pedra", type: "text", required: false },
      {
        name: "gender",
        label: "Gênero",
        type: "select",
        required: true,
        options: ["Feminino", "Masculino", "Unissex"],
      },
      { name: "waterResistance", label: "Resistência à Água", type: "text", required: false },
      {
        name: "mechanism",
        label: "Mecanismo",
        type: "select",
        required: false,
        options: ["Analógico", "Digital", "Híbrido"],
      },
    ],
  },
  {
    id: "electronics",
    name: "Eletrônicos e Tecnologia",
    fields: [
      ...universalFields,
      { name: "voltage", label: "Voltagem", type: "select", required: true, options: ["110V", "220V", "Bivolt"] },
      { name: "processor", label: "Processador", type: "text", required: false },
      { name: "ram", label: "Memória RAM", type: "text", required: false },
      { name: "storage", label: "Armazenamento", type: "text", required: false },
      { name: "os", label: "Sistema Operacional", type: "text", required: false },
      { name: "screenSize", label: "Tamanho da Tela", type: "text", required: false },
      { name: "connectivity", label: "Conectividade", type: "text", required: false },
    ],
  },
  {
    id: "appliances",
    name: "Eletrodomésticos",
    fields: [
      ...universalFields,
      { name: "capacity", label: "Capacidade (L ou Kg)", type: "text", required: true },
      { name: "power", label: "Potência (W)", type: "number", required: true },
      { name: "energyEfficiency", label: "Eficiência Energética", type: "text", required: false },
      { name: "technology", label: "Tecnologia", type: "text", required: false },
      { name: "voltage", label: "Voltagem", type: "select", required: true, options: ["110V", "220V", "Bivolt"] },
    ],
  },
  {
    id: "home",
    name: "Casa, Móveis e Decoração",
    fields: [
      ...universalFields,
      { name: "material", label: "Material de Fabricação", type: "text", required: true },
      { name: "assembly", label: "Necessidade de Montagem", type: "select", required: true, options: ["Sim", "Não"] },
      { name: "dimensions", label: "Dimensões (A x L x P)", type: "text", required: true },
      { name: "doors", label: "Nº de Portas/Gavetas", type: "text", required: false },
    ],
  },
  {
    id: "beauty",
    name: "Beleza e Higiene",
    fields: [
      ...universalFields,
      { name: "volume", label: "Volume/Peso", type: "text", required: true },
      { name: "expiry", label: "Validade", type: "text", required: true },
      { name: "fragrance", label: "Família Olfativa", type: "text", required: false },
      { name: "spf", label: "FPS", type: "text", required: false },
      { name: "activeIngredient", label: "Ativo Principal", type: "text", required: false },
      { name: "skinType", label: "Tipo de Pele/Cabelo", type: "text", required: false },
    ],
  },
  {
    id: "health",
    name: "Saúde, Suplementos e Ortopedia",
    fields: [
      ...universalFields,
      { name: "expiry", label: "Data de Validade", type: "text", required: true },
      { name: "mainIngredient", label: "Ingrediente Principal", type: "text", required: true },
      { name: "dosage", label: "Modo de Uso/Posologia", type: "textarea", required: true },
      { name: "restrictions", label: "Restrições Alimentares", type: "text", required: false },
      { name: "certification", label: "Certificação", type: "text", required: false },
    ],
  },
  {
    id: "automotive",
    name: "Automotivo e Peças",
    fields: [
      ...universalFields,
      { name: "compatibility", label: "Compatibilidade (Marca/Modelo/Ano)", type: "textarea", required: true },
      { name: "oemNumber", label: "Número OEM", type: "text", required: false },
      {
        name: "position",
        label: "Posição",
        type: "select",
        required: false,
        options: ["Dianteira", "Traseira", "Universal"],
      },
      { name: "material", label: "Material", type: "text", required: false },
    ],
  },
  {
    id: "sports",
    name: "Esportes e Lazer",
    fields: [
      ...universalFields,
      { name: "sport", label: "Modalidade", type: "text", required: true },
      { name: "material", label: "Material", type: "text", required: true },
      { name: "maxCapacity", label: "Capacidade Máxima", type: "text", required: false },
      { name: "fabricTech", label: "Tecnologia do Tecido", type: "text", required: false },
    ],
  },
  {
    id: "toys",
    name: "Brinquedos e Bebês",
    fields: [
      ...universalFields,
      { name: "ageRange", label: "Idade Recomendada", type: "text", required: true },
      { name: "certification", label: "Certificação (INMETRO)", type: "text", required: true },
      { name: "maxWeight", label: "Peso Máximo", type: "text", required: false },
      { name: "bpaFree", label: "Livre de BPA", type: "select", required: false, options: ["Sim", "Não"] },
    ],
  },
  {
    id: "books",
    name: "Livros, Mídia e Papelaria",
    fields: [
      ...universalFields,
      { name: "isbn", label: "ISBN", type: "text", required: false },
      { name: "author", label: "Autor/Artista", type: "text", required: true },
      { name: "publisher", label: "Editora", type: "text", required: false },
      { name: "genre", label: "Gênero", type: "text", required: true },
      {
        name: "format",
        label: "Formato",
        type: "select",
        required: true,
        options: ["Capa Dura", "Capa Comum", "Ebook", "Audiobook"],
      },
      { name: "language", label: "Idioma", type: "text", required: true },
      { name: "pages", label: "Nº de Páginas", type: "number", required: false },
    ],
  },
  {
    id: "games",
    name: "Games",
    fields: [
      ...universalFields,
      { name: "platform", label: "Plataforma", type: "text", required: true },
      { name: "genre", label: "Gênero", type: "text", required: true },
      { name: "ageRating", label: "Classificação Etária", type: "text", required: true },
      { name: "requirements", label: "Requisitos Mínimos", type: "textarea", required: false },
    ],
  },
  {
    id: "tools",
    name: "Ferramentas e Melhorias para Casa",
    fields: [
      ...universalFields,
      { name: "power", label: "Potência", type: "text", required: false },
      {
        name: "voltage",
        label: "Voltagem",
        type: "select",
        required: false,
        options: ["110V", "220V", "Bivolt", "Bateria"],
      },
      { name: "usage", label: "Uso", type: "select", required: true, options: ["Doméstico", "Profissional"] },
      { name: "material", label: "Material", type: "text", required: true },
    ],
  },
  {
    id: "garden",
    name: "Jardim e Piscina",
    fields: [
      ...universalFields,
      { name: "plantType", label: "Tipo de Planta/Semente", type: "text", required: false },
      { name: "growingConditions", label: "Condições de Cultivo", type: "textarea", required: false },
      { name: "composition", label: "Composição Química", type: "text", required: false },
      { name: "volume", label: "Volume/Tratamento", type: "text", required: false },
    ],
  },
  {
    id: "food",
    name: "Alimentos e Bebidas",
    fields: [
      ...universalFields,
      { name: "volume", label: "Volume/Peso", type: "text", required: true },
      { name: "expiry", label: "Validade", type: "text", required: true },
      { name: "ingredients", label: "Ingredientes", type: "textarea", required: true },
      { name: "nutrition", label: "Tabela Nutricional", type: "textarea", required: false },
      { name: "allergens", label: "Alergênicos", type: "text", required: false },
      { name: "alcoholContent", label: "Teor Alcoólico", type: "text", required: false },
    ],
  },
  {
    id: "pets",
    name: "Pets",
    fields: [
      ...universalFields,
      {
        name: "species",
        label: "Espécie",
        type: "select",
        required: true,
        options: ["Cão", "Gato", "Pássaro", "Outro"],
      },
      { name: "size", label: "Porte/Idade", type: "text", required: false },
      { name: "flavor", label: "Sabor/Composição", type: "text", required: false },
      { name: "expiry", label: "Data de Validade", type: "text", required: false },
    ],
  },
  {
    id: "instruments",
    name: "Instrumentos Musicais",
    fields: [
      ...universalFields,
      { name: "instrumentType", label: "Tipo de Instrumento", type: "text", required: true },
      { name: "material", label: "Material", type: "text", required: true },
      { name: "finish", label: "Acabamento", type: "text", required: false },
      { name: "pickup", label: "Tipo de Captação", type: "text", required: false },
    ],
  },
  {
    id: "collectibles",
    name: "Colecionáveis e Artesanato",
    fields: [
      ...universalFields,
      { name: "material", label: "Material", type: "text", required: true },
      { name: "yearEdition", label: "Ano/Edição", type: "text", required: false },
      {
        name: "condition",
        label: "Condição",
        type: "select",
        required: true,
        options: ["Novo", "Usado - Excelente", "Usado - Bom", "Usado - Regular"],
      },
      {
        name: "certificate",
        label: "Certificado de Autenticidade",
        type: "select",
        required: false,
        options: ["Sim", "Não"],
      },
    ],
  },
  {
    id: "party",
    name: "Artigos de Festa",
    fields: [
      ...universalFields,
      { name: "theme", label: "Tema", type: "text", required: true },
      { name: "material", label: "Material", type: "text", required: true },
      { name: "size", label: "Tamanho", type: "text", required: false },
      { name: "quantity", label: "Quantidade por Pacote", type: "number", required: false },
    ],
  },
  {
    id: "industrial",
    name: "Equipamentos Industriais e Científicos",
    fields: [
      ...universalFields,
      {
        name: "usage",
        label: "Uso",
        type: "select",
        required: true,
        options: ["Industrial", "Comercial", "Laboratorial"],
      },
      { name: "specifications", label: "Especificações Técnicas", type: "textarea", required: true },
      { name: "certifications", label: "Certificações", type: "text", required: false },
      { name: "capacity", label: "Capacidade", type: "text", required: false },
    ],
  },
  {
    id: "ppe",
    name: "EPIs",
    fields: [
      ...universalFields,
      { name: "protectionLevel", label: "Nível de Proteção/Certificação (CA)", type: "text", required: true },
      { name: "material", label: "Material", type: "text", required: true },
      { name: "size", label: "Tamanho", type: "text", required: true },
      { name: "usage", label: "Uso", type: "select", required: true, options: ["Ocupacional", "Doméstico"] },
    ],
  },
  {
    id: "services",
    name: "Serviços",
    fields: [
      { name: "serviceType", label: "Tipo de Serviço", type: "text", required: true },
      { name: "duration", label: "Duração", type: "text", required: true },
      {
        name: "modality",
        label: "Modalidade",
        type: "select",
        required: true,
        options: ["Online", "Presencial", "Híbrido"],
      },
      { name: "coverage", label: "Área de Cobertura (CEP)", type: "text", required: false },
      { name: "cancellationPolicy", label: "Política de Cancelamento", type: "textarea", required: true },
    ],
  },
]
