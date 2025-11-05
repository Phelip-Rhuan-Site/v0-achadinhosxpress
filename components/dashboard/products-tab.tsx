"use client"

import { useState, useEffect } from "react"
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  query,
  where,
} from "firebase/firestore"
import { db } from "@/lib/firebase/config"
import { useAuth } from "@/lib/contexts/auth-context"
import type { Product } from "@/lib/types/product"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ProductForm } from "./product-form"
import { ProductList } from "./product-list"
import { Plus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { uploadMultipleImagesToCloudinary, uploadVideoToCloudinary } from "@/lib/utils/cloudinary"

export function ProductsTab() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const { user } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const snapshot = await getDocs(collection(db, "products"))
      const fetchedProducts = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Product[]
      setProducts(fetchedProducts)
    } catch (error) {
      console.error("Error fetching products:", error)
      toast({
        title: "Erro ao carregar produtos",
        description: "Tente novamente mais tarde",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const generatePostingCode = async (): Promise<string> => {
    const timestamp = Date.now().toString().slice(-6)
    const random = Math.floor(Math.random() * 100)
      .toString()
      .padStart(2, "0")
    const code = timestamp + random

    const productsRef = collection(db, "products")
    const q = query(productsRef, where("codigoPostagem", "==", code))
    const snapshot = await getDocs(q)

    if (!snapshot.empty) {
      return generatePostingCode()
    }

    return code
  }

  const handleSaveProduct = async (productData: Partial<Product>, images: File[], video: File | null) => {
    console.log("[v0] handleSaveProduct started")
    console.log("[v0] Product data:", productData)
    console.log("[v0] Images count:", images.length)
    console.log("[v0] Video:", video ? "yes" : "no")

    try {
      let imageUrls: string[] = []

      if (images.length > 0) {
        console.log("[v0] Uploading images to Cloudinary...")
        try {
          imageUrls = await uploadMultipleImagesToCloudinary(images)
          console.log(`[v0] ${imageUrls.length} images uploaded successfully`)
        } catch (uploadError: any) {
          console.error("[v0] Error uploading images:", uploadError)
          throw new Error(uploadError.message || "Erro ao fazer upload das imagens")
        }
      }

      let videoUrl: string | undefined
      if (video) {
        console.log("[v0] Uploading video to Cloudinary...")
        try {
          videoUrl = await uploadVideoToCloudinary(video)
          console.log("[v0] Video uploaded successfully")
        } catch (uploadError: any) {
          console.error("[v0] Error uploading video:", uploadError)
          throw new Error(uploadError.message || "Erro ao fazer upload do vídeo")
        }
      }

      let codigoPostagem = productData.codigoPostagem
      if (!editingProduct && !codigoPostagem) {
        console.log("[v0] Generating posting code...")
        codigoPostagem = await generatePostingCode()
        console.log("[v0] Generated posting code:", codigoPostagem)
      }

      const productPayload = {
        ...productData,
        images: imageUrls.length > 0 ? imageUrls : productData.images || [],
        ...(videoUrl || productData.video ? { video: videoUrl || productData.video } : {}),
        ...(codigoPostagem ? { codigoPostagem } : {}),
        updatedAt: serverTimestamp(),
        createdBy: user?.email || "unknown",
      }

      console.log("[v0] Final payload prepared (images as Cloudinary URLs)")

      if (editingProduct) {
        console.log("[v0] Updating product:", editingProduct.id)
        await updateDoc(doc(db, "products", editingProduct.id), productPayload)
        console.log("[v0] Product updated successfully")

        toast({
          title: "Produto atualizado",
          description: "O produto foi atualizado com sucesso",
        })
      } else {
        console.log("[v0] Creating new product...")
        const docRef = await addDoc(collection(db, "products"), {
          ...productPayload,
          createdAt: serverTimestamp(),
          views: 0,
          stock: productData.stock || 0,
        })
        console.log("[v0] Product created with ID:", docRef.id)

        toast({
          title: "Produto criado",
          description: `Produto criado com código: ${codigoPostagem}`,
        })
      }

      setShowForm(false)
      setEditingProduct(null)
      await fetchProducts()

      console.log("[v0] handleSaveProduct completed successfully")
    } catch (error) {
      console.error("[v0] Error in handleSaveProduct:", error)

      toast({
        title: "Erro ao salvar produto",
        description: error instanceof Error ? error.message : "Tente novamente mais tarde",
        variant: "destructive",
      })

      throw error
    }
  }

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product)
    setShowForm(true)
  }

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm("Tem certeza que deseja excluir este produto?")) return

    try {
      await deleteDoc(doc(db, "products", productId))
      toast({
        title: "Produto excluído",
        description: "O produto foi excluído com sucesso",
      })
      fetchProducts()
    } catch (error) {
      console.error("Error deleting product:", error)
      toast({
        title: "Erro ao excluir produto",
        description: "Tente novamente mais tarde",
        variant: "destructive",
      })
    }
  }

  const handleTogglePublish = async (product: Product) => {
    try {
      await updateDoc(doc(db, "products", product.id), {
        published: !product.published,
      })
      toast({
        title: product.published ? "Produto despublicado" : "Produto publicado",
        description: product.published
          ? "O produto não está mais visível no site"
          : "O produto agora está visível no site",
      })
      fetchProducts()
    } catch (error) {
      console.error("Error toggling publish:", error)
      toast({
        title: "Erro ao alterar status",
        description: "Tente novamente mais tarde",
        variant: "destructive",
      })
    }
  }

  const handleToggleActive = async (product: Product) => {
    try {
      await updateDoc(doc(db, "products", product.id), {
        active: !product.active,
      })
      toast({
        title: product.active ? "Produto desativado" : "Produto ativado",
      })
      fetchProducts()
    } catch (error) {
      console.error("Error toggling active:", error)
      toast({
        title: "Erro ao alterar status",
        description: "Tente novamente mais tarde",
        variant: "destructive",
      })
    }
  }

  const handleUpdateStock = async (productId: string, change: number) => {
    try {
      const product = products.find((p) => p.id === productId)
      if (!product) return

      const newStock = Math.max(0, product.stock + change)
      await updateDoc(doc(db, "products", productId), {
        stock: newStock,
      })
      fetchProducts()
    } catch (error) {
      console.error("Error updating stock:", error)
      toast({
        title: "Erro ao atualizar estoque",
        description: "Tente novamente mais tarde",
        variant: "destructive",
      })
    }
  }

  if (showForm) {
    return (
      <Card className="border-primary/20 bg-card/50 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-primary">{editingProduct ? "Editar Produto" : "Novo Produto"}</CardTitle>
        </CardHeader>
        <CardContent>
          <ProductForm
            product={editingProduct}
            onSave={handleSaveProduct}
            onCancel={() => {
              setShowForm(false)
              setEditingProduct(null)
            }}
          />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-primary/20 bg-card/50 backdrop-blur">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-primary">Produtos</CardTitle>
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90" onClick={() => setShowForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Produto
        </Button>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <ProductList
            products={products}
            onEdit={handleEditProduct}
            onDelete={handleDeleteProduct}
            onTogglePublish={handleTogglePublish}
            onToggleActive={handleToggleActive}
            onUpdateStock={handleUpdateStock}
          />
        )}
      </CardContent>
    </Card>
  )
}
