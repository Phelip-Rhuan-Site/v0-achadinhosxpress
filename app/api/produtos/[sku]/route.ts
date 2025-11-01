import type { NextRequest } from "next/server"
import { collection, query, where, getDocs, updateDoc, doc, serverTimestamp } from "firebase/firestore"
import { db } from "@/lib/firebase/config"
import { validateApiKey, unauthorizedResponse } from "@/lib/api/auth-middleware"

// PUT /api/produtos/[sku] - Atualizar produto
export async function PUT(request: NextRequest, { params }: { params: { sku: string } }) {
  if (!validateApiKey(request)) {
    return unauthorizedResponse()
  }

  try {
    const { sku } = params
    const body = await request.json()

    const {
      nome,
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
      status,
      // Legacy fields for backward compatibility
      titulo,
      afiliado_url,
    } = body

    const productsRef = collection(db, "products")
    const q = query(productsRef, where("sku", "==", sku))
    const snapshot = await getDocs(q)

    if (snapshot.empty) {
      return Response.json({ ok: false, mensagem: "Produto não encontrado" }, { status: 404 })
    }

    const productDoc = snapshot.docs[0]

    const updateData: any = {
      updatedAt: serverTimestamp(),
    }

    // Universal fields
    if (nome !== undefined || titulo !== undefined) updateData.name = nome || titulo
    if (preco !== undefined) updateData.price = preco
    if (url_afiliado !== undefined || afiliado_url !== undefined) updateData.url = url_afiliado || afiliado_url
    if (imagens !== undefined) updateData.images = imagens
    if (descricao !== undefined) updateData.description = descricao
    if (ean_gtin !== undefined) updateData.ean_gtin = ean_gtin
    if (marca !== undefined) updateData.marca = marca
    if (peso !== undefined) updateData.peso = peso
    if (dimensoes !== undefined) updateData.dimensoes = dimensoes
    if (garantia !== undefined) updateData.garantia = garantia
    if (categoria_principal !== undefined) updateData.category = categoria_principal
    if (subcategoria !== undefined) updateData.subcategoria = subcategoria
    if (estoque !== undefined) updateData.stock = estoque

    // Specific attributes
    if (atributos_especificos !== undefined) updateData.atributos_especificos = atributos_especificos

    // Status
    if (status !== undefined) {
      updateData.active = status === "ativo"
      updateData.published = status === "ativo"
    }

    await updateDoc(doc(db, "products", productDoc.id), updateData)

    return Response.json({ ok: true, mensagem: "Produto atualizado com sucesso" })
  } catch (error) {
    console.error("[v0] Error updating product:", error)
    return Response.json({ ok: false, mensagem: "Erro ao atualizar produto" }, { status: 500 })
  }
}
