"use client"

import { useState, useEffect } from "react"
import { collection, query, where, getDocs, doc, updateDoc, increment } from "firebase/firestore"
import { db } from "@/lib/firebase/config"
import type { Product } from "@/lib/types/product"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { ProductGrid } from "@/components/products/product-grid"
import { ProductFilters } from "@/components/products/product-filters"
import { Pagination } from "@/components/products/pagination"
import { ProductModal } from "@/components/products/product-modal"
import { InstallPrompt } from "@/components/pwa/install-prompt"
import { useCart } from "@/lib/hooks/use-cart"
import { useToast } from "@/hooks/use-toast"
import { useFCM } from "@/lib/hooks/use-fcm"

const ITEMS_PER_PAGE_MOBILE = 10
const ITEMS_PER_PAGE_DESKTOP = 50

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStores, setSelectedStores] = useState<string[]>([])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [sortBy, setSortBy] = useState("recent")
  const [isMobile, setIsMobile] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  const { addToCart } = useCart()
  const { toast } = useToast()

  // Initialize FCM
  useFCM()

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // Fetch products
  useEffect(() => {
    fetchProducts()
  }, [currentPage, searchQuery, selectedStores, selectedCategories, sortBy, isMobile])

  const fetchProducts = async () => {
    setLoading(true)
    try {
      // Filter active products in memory to avoid needing a composite index
      const q = query(collection(db, "products"), where("published", "==", true))

      const snapshot = await getDocs(q)
      let fetchedProducts = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Product[]

      fetchedProducts = fetchedProducts.filter((p) => p.active === true)

      // Filter by stores
      if (selectedStores.length > 0) {
        fetchedProducts = fetchedProducts.filter((p) => selectedStores.includes(p.store))
      }

      // Filter by categories
      if (selectedCategories.length > 0) {
        fetchedProducts = fetchedProducts.filter((p) => selectedCategories.includes(p.category))
      }

      // Filter by search query
      if (searchQuery) {
        const lowerQuery = searchQuery.toLowerCase()
        fetchedProducts = fetchedProducts.filter(
          (p) =>
            p.name.toLowerCase().includes(lowerQuery) ||
            p.store.toLowerCase().includes(lowerQuery) ||
            p.category.toLowerCase().includes(lowerQuery) ||
            p.description.toLowerCase().includes(lowerQuery),
        )
      }

      switch (sortBy) {
        case "price-asc":
          fetchedProducts.sort((a, b) => a.price - b.price)
          break
        case "price-desc":
          fetchedProducts.sort((a, b) => b.price - a.price)
          break
        case "views":
          fetchedProducts.sort((a, b) => (b.views || 0) - (a.views || 0))
          break
        default:
          // Sort by createdAt desc (most recent first)
          fetchedProducts.sort((a, b) => {
            const aTime = a.createdAt?.seconds || 0
            const bTime = b.createdAt?.seconds || 0
            return bTime - aTime
          })
          break
      }

      setProducts(fetchedProducts)

      // Calculate total pages
      const itemsPerPage = isMobile ? ITEMS_PER_PAGE_MOBILE : ITEMS_PER_PAGE_DESKTOP
      const total = Math.ceil(fetchedProducts.length / itemsPerPage)
      setTotalPages(total)
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

  const handleAddToCart = (product: Product) => {
    addToCart(product)
    logEvent("add_to_cart", product)
  }

  const handleViewOffer = async (product: Product) => {
    setSelectedProduct(product)
    setModalOpen(true)

    // Increment views
    try {
      await updateDoc(doc(db, "products", product.id), {
        views: increment(1),
      })
    } catch (error) {
      console.error("Error updating views:", error)
    }

    logEvent("view_offer", product)
  }

  const logEvent = (eventName: string, product: Product) => {
    try {
      console.log(`[Event] ${eventName}:`, product.id)
    } catch (error) {
      console.error("Error logging event:", error)
    }
  }

  const handleClearFilters = () => {
    setSelectedStores([])
    setSelectedCategories([])
    setSearchQuery("")
    setCurrentPage(1)
  }

  const itemsPerPage = isMobile ? ITEMS_PER_PAGE_MOBILE : ITEMS_PER_PAGE_DESKTOP
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedProducts = products.slice(startIndex, endIndex)

  return (
    <div className="min-h-screen flex flex-col">
      <Header onSearch={setSearchQuery} />

      <main className="flex-1 container mx-auto px-4 py-8">
        <ProductFilters
          selectedStores={selectedStores}
          selectedCategories={selectedCategories}
          sortBy={sortBy}
          onStoresChange={setSelectedStores}
          onCategoriesChange={setSelectedCategories}
          onSortChange={setSortBy}
          onClearFilters={handleClearFilters}
        />

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            <ProductGrid products={paginatedProducts} onAddToCart={handleAddToCart} onViewOffer={handleViewOffer} />

            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
          </>
        )}
      </main>

      <ProductModal
        product={selectedProduct}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onAddToCart={handleAddToCart}
      />

      <InstallPrompt />

      <Footer />
    </div>
  )
}
