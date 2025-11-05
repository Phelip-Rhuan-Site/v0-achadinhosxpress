"use client"

import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useCart } from "@/lib/hooks/use-cart"
import { useLanguage } from "@/lib/contexts/language-context"
import Image from "next/image"
import { Trash2, Plus, Minus, ExternalLink, ShoppingBag } from "lucide-react"
import { useRouter } from "next/navigation"
import { formatPrice } from "@/lib/utils/format-price"

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, clearCart, clearCartByStore, getCartTotal, getCartByStore } = useCart()
  const { t, language } = useLanguage()
  const router = useRouter()
  const cartByStore = getCartByStore()
  const stores = Object.keys(cartByStore)

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center space-y-6">
            <ShoppingBag className="h-24 w-24 mx-auto text-muted-foreground" />
            <h1 className="text-3xl font-bold text-foreground">{t("cart.empty")}</h1>
            <p className="text-muted-foreground">{t("cart.continueShopping")}</p>
            <Button
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={() => router.push("/")}
            >
              {t("cart.continueShopping")}
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const handleBuyItem = (url: string, productId: string) => {
    // Log buy_click event
    console.log("[Event] buy_click:", productId)

    // Open product URL
    window.open(url, "_blank", "noopener,noreferrer")
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-foreground">{t("cart.title")}</h1>
            <Button
              variant="outline"
              className="border-destructive/20 text-destructive hover:bg-destructive/10 bg-transparent"
              onClick={clearCart}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              {t("cart.clearAll")}
            </Button>
          </div>

          <div className="space-y-6">
            {/* Group by Store */}
            {stores.map((store) => (
              <Card key={store} className="border-primary/20 bg-card/50 backdrop-blur">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-xl text-primary">{store}</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive/80 hover:bg-destructive/10"
                    onClick={() => clearCartByStore(store)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    {t("cart.remove")}
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  {cartByStore[store].map((item) => (
                    <div
                      key={item.product.id}
                      className="flex gap-4 p-4 rounded-lg border border-primary/10 bg-background/50"
                    >
                      {/* Product Image */}
                      <div className="relative w-24 h-24 flex-shrink-0 rounded overflow-hidden bg-background">
                        <Image
                          src={item.product.images[0] || "/placeholder.svg?height=200&width=200"}
                          alt={item.product.name}
                          fill
                          className="object-contain p-2"
                        />
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground line-clamp-2 mb-2">{item.product.name}</h3>
                        <p className="text-lg font-bold text-primary mb-3">
                          {formatPrice(item.product.price, language)}
                        </p>

                        <div className="flex items-center gap-4">
                          {/* Quantity Controls */}
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 border-primary/20 bg-transparent"
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="w-8 text-center text-foreground font-medium">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 border-primary/20 bg-transparent"
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>

                          {/* Buy Button */}
                          <Button
                            size="sm"
                            className="bg-primary text-primary-foreground hover:bg-primary/90"
                            onClick={() => handleBuyItem(item.product.url, item.product.id)}
                          >
                            <ExternalLink className="mr-2 h-4 w-4" />
                            {t("cart.buy")}
                          </Button>

                          {/* Remove Button */}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="ml-auto text-destructive hover:text-destructive/80 hover:bg-destructive/10"
                            onClick={() => removeFromCart(item.product.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}

            {/* Total */}
            <Card className="border-primary/20 bg-card/50 backdrop-blur">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between text-2xl font-bold">
                  <span className="text-foreground">{t("cart.total")}</span>
                  <span className="text-primary">{formatPrice(getCartTotal(), language)}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
