import type { NextRequest } from "next/server"
import { collection, addDoc, query, where, getDocs, serverTimestamp } from "firebase/firestore"
import { db } from "@/lib/firebase/config"
import { validateApiKey, unauthorizedResponse } from "@/lib/api/auth-middleware"

// POST /api/produtos - Criar produto
export async function POST(request: NextRequest) {
  if (!validateApiKey(request)) {
    return unauthorizedResponse()
  }

  try {
    const body = await request.json()

    const {
      nome,
      sku,
      ean_gtin,
      marca,
      preco,
      estoque,
      peso,
      dimensoes,
      descricao,
      garantia,
      imagens,
      url_afiliado,
      categoria_principal,
      subcategoria,
      atributos_especificos,
      // Legacy fields for backward compatibility
      titulo,
      afiliado_url,
      status,
    } = body

    const productName = nome || titulo
    const productPrice = preco
    const productUrl = url_afiliado || afiliado_url
    const productSku = sku

    if (!productSku || !productName || !productPrice || !productUrl) {
      return Response.json(
        {
          ok: false,
          mensagem: "Campos obrigatórios: sku, nome (ou titulo), preco, url_afiliado (ou afiliado_url)",
        },
        { status: 400 },
      )
    }

    const productsRef = collection(db, "products")
    const q = query(productsRef, where("sku", "==", productSku))
    const snapshot = await getDocs(q)

    if (!snapshot.empty) {
      return Response.json({ ok: false, mensagem: "Produto com este SKU já existe" }, { status: 409 })
    }

    const productData = {
      sku: productSku,
      name: productName,
      price: productPrice,
      url: productUrl,
      images: imagens || [],
      description: descricao || "",
      // New universal fields
      ean_gtin: ean_gtin || null,
      marca: marca || null,
      peso: peso || null,
      dimensoes: dimensoes || null,
      garantia: garantia || null,
      category: categoria_principal || "Geral",
      subcategoria: subcategoria || null,
      // Specific attributes object
      atributos_especificos: atributos_especificos || {},
      // Status and stock
      stock: estoque !== undefined ? estoque : 999,
      active: status === "ativo" || status === undefined,
      published: status === "ativo" || status === undefined,
      // Default values for required fields
      store: "API Bot",
      characteristics: {},
      views: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      createdBy: "api-bot",
    }

    await addDoc(productsRef, productData)

    return Response.json({ ok: true, mensagem: "Produto criado com sucesso" }, { status: 201 })
  } catch (error) {
    console.error("[v0] Error creating product:", error)
    return Response.json({ ok: false, mensagem: "Erro ao criar produto" }, { status: 500 })
  }
}

// GET /api/produtos?sku=TENIS123 - Consultar se produto existe
export async function GET(request: NextRequest) {
  if (!validateApiKey(request)) {
    return unauthorizedResponse()
  }

  try {
    const searchParams = request.nextUrl.searchParams
    const sku = searchParams.get("sku")

    if (!sku) {
      return Response.json({ ok: false, mensagem: "Parâmetro sku é obrigatório" }, { status: 400 })
    }

    const productsRef = collection(db, "products")
    const q = query(productsRef, where("sku", "==", sku))
    const snapshot = await getDocs(q)

    if (snapshot.empty) {
      return Response.json({ existe: false })
    }

    const productDoc = snapshot.docs[0]
    const product = productDoc.data()

    return Response.json({
      existe: true,
      preco: product.price,
      status: product.active ? "ativo" : "inativo",
    })
  } catch (error) {
    console.error("[v0] Error checking product:", error)
    return Response.json({ ok: false, mensagem: "Erro ao consultar produto" }, { status: 500 })
  }
}
