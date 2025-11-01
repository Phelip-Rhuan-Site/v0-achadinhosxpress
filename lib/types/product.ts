export interface Product {
  id: string
  sku: string // Required for API bot
  ean_gtin?: string // EAN/GTIN barcode
  name: string
  marca?: string // Brand
  price: number
  preco_de?: number // Original price (for comparison)
  preco_por?: number // Current price (for comparison)
  store: string
  category: string
  subcategoria?: string // Subcategory
  url: string
  description: string
  images: string[]
  video?: string
  peso?: string // Weight (e.g., "0.800kg")
  dimensoes?: string // Dimensions (e.g., "32x22x12")
  garantia?: string // Warranty (e.g., "90 dias")
  characteristics: Record<string, any>
  atributos_especificos?: Record<string, any> // Category-specific attributes
  published: boolean
  active: boolean
  stock: number
  views: number
  createdAt: Date
  updatedAt: Date
  createdBy: string
}

export interface CartItem {
  product: Product
  quantity: number
}

export const STORES = [
  "C&A",
  "Renner",
  "Shein",
  "AliExpress",
  "Vivara",
  "Vans",
  "Casas Bahia",
  "FARM Rio",
  "Riachuelo",
  "Shopee",
  "Amazon",
  "Mercado Livre",
] as const

export type Store = (typeof STORES)[number]
