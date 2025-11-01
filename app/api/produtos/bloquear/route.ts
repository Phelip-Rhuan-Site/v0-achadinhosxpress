import type { NextRequest } from "next/server"
import { collection, query, where, getDocs, updateDoc, doc, serverTimestamp } from "firebase/firestore"
import { db } from "@/lib/firebase/config"
import { validateApiKey, unauthorizedResponse } from "@/lib/api/auth-middleware"

// POST /api/produtos/bloquear - Bloquear produto
export async function POST(request: NextRequest) {
  if (!validateApiKey(request)) {
    return unauthorizedResponse()
  }

  try {
    const body = await request.json()
    const { sku } = body

    if (!sku) {
      return Response.json({ ok: false, mensagem: "Campo sku é obrigatório" }, { status: 400 })
    }

    const productsRef = collection(db, "products")
    const q = query(productsRef, where("sku", "==", sku))
    const snapshot = await getDocs(q)

    if (snapshot.empty) {
      return Response.json({ ok: false, mensagem: "Produto não encontrado" }, { status: 404 })
    }

    const productDoc = snapshot.docs[0]

    await updateDoc(doc(db, "products", productDoc.id), {
      active: false,
      published: false,
      updatedAt: serverTimestamp(),
    })

    return Response.json({ ok: true, mensagem: "Produto bloqueado" })
  } catch (error) {
    console.error("[v0] Error blocking product:", error)
    return Response.json({ ok: false, mensagem: "Erro ao bloquear produto" }, { status: 500 })
  }
}
