"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import type { Product } from "@/lib/types/product"
import { STORES } from "@/lib/types/product"
import { CATEGORIES } from "@/lib/types/categories"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useLanguage } from "@/lib/contexts/language-context"
import { Upload, X, HelpCircle, Copy, Check } from "lucide-react"

interface ProductFormProps {
  product: Product | null
  onSave: (product: Partial<Product>, images: File[], video: File | null) => void
  onCancel: () => void
}

export function ProductForm({ product, onSave, onCancel }: ProductFormProps) {
  const { t } = useLanguage()
  const [formData, setFormData] = useState<Partial<Product>>({
    name: "",
    price: 0,
    preco_de: undefined,
    preco_por: undefined,
    store: "",
    category: "",
    url: "",
    description: "",
    characteristics: {},
    published: false,
    active: true,
    stock: 0,
    images: [],
    codigoPostagem: "", // Assuming this field exists in Product type
  })

  const [priceInput, setPriceInput] = useState("")
  const [precoDeInput, setPrecoDeInput] = useState("")
  const [precoPorInput, setPrecoPorInput] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [copiedCode, setCopiedCode] = useState(false)

  const imageDropRef = useRef<HTMLDivElement>(null)
  const videoDropRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (product) {
      setFormData(product)
      setSelectedCategory(product.category)
      setImagePreviews(product.images || [])
      setPriceInput(product.price?.toString().replace(".", ",") || "")
      setPrecoDeInput(product.preco_de?.toString().replace(".", ",") || "")
      setPrecoPorInput(product.preco_por?.toString().replace(".", ",") || "")
    }
  }, [product])

  const category = CATEGORIES.find((c) => c.id === selectedCategory)

  const parsePrice = (value: string): number => {
    if (!value) return 0

    // Remove all spaces
    let cleaned = value.trim().replace(/\s/g, "")

    // Count dots and commas to determine format
    const dotCount = (cleaned.match(/\./g) || []).length
    const commaCount = (cleaned.match(/,/g) || []).length

    if (dotCount > 0 && commaCount > 0) {
      // Mixed format: determine which is decimal separator
      const lastDot = cleaned.lastIndexOf(".")
      const lastComma = cleaned.lastIndexOf(",")

      if (lastComma > lastDot) {
        // European format: "1.234,56" → "1234.56"
        cleaned = cleaned.replace(/\./g, "").replace(",", ".")
      } else {
        // US format: "1,234.56" → "1234.56"
        cleaned = cleaned.replace(/,/g, "")
      }
    } else if (commaCount > 0) {
      // Only commas: could be "7214,30" (decimal) or "1,234" (thousands)
      if (commaCount === 1 && cleaned.split(",")[1]?.length === 2) {
        // Decimal comma: "7214,30" → "7214.30"
        cleaned = cleaned.replace(",", ".")
      } else {
        // Thousands separator: "1,234" → "1234"
        cleaned = cleaned.replace(/,/g, "")
      }
    }
    // If only dots, assume US format (already correct)

    const parsed = Number.parseFloat(cleaned)

    console.log("[v0] parsePrice:", { input: value, cleaned, parsed })

    return isNaN(parsed) ? 0 : parsed
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handlePriceChange = (field: "price" | "preco_de" | "preco_por", value: string) => {
    if (field === "price") {
      setPriceInput(value)
      setFormData((prev) => ({ ...prev, price: parsePrice(value) }))
    } else if (field === "preco_de") {
      setPrecoDeInput(value)
      setFormData((prev) => ({ ...prev, preco_de: value ? parsePrice(value) : undefined }))
    } else if (field === "preco_por") {
      setPrecoPorInput(value)
      setFormData((prev) => ({ ...prev, preco_por: value ? parsePrice(value) : undefined }))
    }
  }

  const handleCharacteristicChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      characteristics: {
        ...prev.characteristics,
        [field]: value,
      },
    }))
  }

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId)
    setFormData((prev) => ({
      ...prev,
      category: categoryId,
      characteristics: {},
    }))
  }

  const handleImageDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const files = Array.from(e.dataTransfer.files).filter((file) => file.type.startsWith("image/"))
    if (files.length > 0) {
      setImageFiles((prev) => [...prev, ...files])
      files.forEach((file) => {
        const reader = new FileReader()
        reader.onloadend = () => {
          setImagePreviews((prev) => [...prev, reader.result as string])
        }
        reader.readAsDataURL(file)
      })
    }
  }

  const handleVideoDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const file = Array.from(e.dataTransfer.files).find((file) => file.type.startsWith("video/"))
    if (file) {
      setVideoFile(file)
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setImageFiles((prev) => [...prev, ...files])

    files.forEach((file) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreviews((prev) => [...prev, reader.result as string])
      }
      reader.readAsDataURL(file)
    })
  }

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setVideoFile(file)
    }
  }

  const removeImage = (index: number) => {
    setImagePreviews((prev) => prev.filter((_, i) => i !== index))
    setImageFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    console.log("[v0] Form submit triggered")

    // Prevent double submission
    if (isSubmitting) {
      console.log("[v0] Already submitting, ignoring")
      return
    }

    // Basic validation
    if (!formData.name?.trim()) {
      alert("Por favor, preencha o nome do produto")
      return
    }

    if (!formData.price || formData.price <= 0) {
      alert("Por favor, preencha um preço válido")
      return
    }

    if (!formData.store) {
      alert("Por favor, selecione uma loja")
      return
    }

    if (!formData.category) {
      alert("Por favor, selecione uma categoria")
      return
    }

    if (!formData.url?.trim()) {
      alert("Por favor, preencha a URL do produto")
      return
    }

    if (!formData.description?.trim()) {
      alert("Por favor, preencha a descrição")
      return
    }

    // Category-specific validation
    if (category) {
      const requiredFields = category.fields.filter((f) => f.required)
      const missingFields = requiredFields.filter((f) => !formData.characteristics?.[f.name])
      if (missingFields.length > 0) {
        alert(`Por favor, preencha os campos obrigatórios: ${missingFields.map((f) => f.label).join(", ")}`)
        return
      }
    }

    console.log("[v0] Validation passed, calling onSave")
    setIsSubmitting(true)

    try {
      await onSave(formData, imageFiles, videoFile)
      console.log("[v0] onSave completed successfully")
    } catch (error) {
      console.error("[v0] Error in onSave:", error)

      const errorMessage = error instanceof Error ? error.message : "Erro desconhecido ao salvar produto"

      alert("Erro ao salvar produto:\n\n" + errorMessage)
    } finally {
      console.log("[v0] Resetting isSubmitting to false")
      setIsSubmitting(false)
    }
  }

  const handleCopyCode = async () => {
    if (formData.codigoPostagem) {
      await navigator.clipboard.writeText(formData.codigoPostagem)
      setCopiedCode(true)
      setTimeout(() => setCopiedCode(false), 2000)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Posting Code Display Section */}
      {product?.codigoPostagem && (
        <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-foreground font-semibold">Código de Postagem</Label>
              <p className="text-sm text-muted-foreground mt-1">Use este código para divulgar nas redes sociais</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-primary font-mono">{product.codigoPostagem}</span>
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="border-primary/20 bg-transparent"
                onClick={handleCopyCode}
              >
                {copiedCode ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Basic Fields */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-foreground">
            Nome do Produto *
          </Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            required
            className="bg-background/50 border-primary/20 text-foreground"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="price" className="text-foreground">
            Preço (R$) *
          </Label>
          <Input
            id="price"
            type="text"
            value={priceInput}
            onChange={(e) => handlePriceChange("price", e.target.value)}
            placeholder="Ex: 199,90 ou 199.90"
            required
            className="bg-background/50 border-primary/20 text-foreground"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="preco_de" className="text-foreground flex items-center gap-2">
            Preço De (R$)
            <HelpCircle className="h-3 w-3 text-muted-foreground" />
          </Label>
          <Input
            id="preco_de"
            type="text"
            value={precoDeInput}
            onChange={(e) => handlePriceChange("preco_de", e.target.value)}
            placeholder="Ex: 299,90 (preço antigo)"
            className="bg-background/50 border-primary/20 text-foreground"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="preco_por" className="text-foreground flex items-center gap-2">
            Preço Por (R$)
            <HelpCircle className="h-3 w-3 text-muted-foreground" />
          </Label>
          <Input
            id="preco_por"
            type="text"
            value={precoPorInput}
            onChange={(e) => handlePriceChange("preco_por", e.target.value)}
            placeholder="Ex: 199,90 (preço atual)"
            className="bg-background/50 border-primary/20 text-foreground"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="store" className="text-foreground">
            Loja *
          </Label>
          <Select value={formData.store} onValueChange={(value) => handleInputChange("store", value)}>
            <SelectTrigger className="bg-background/50 border-primary/20 text-foreground">
              <SelectValue placeholder="Selecione a loja" />
            </SelectTrigger>
            <SelectContent className="bg-card border-primary/20">
              {STORES.map((store) => (
                <SelectItem key={store} value={store}>
                  {store}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="category" className="text-foreground">
            Categoria *
          </Label>
          <Select value={selectedCategory} onValueChange={handleCategoryChange}>
            <SelectTrigger className="bg-background/50 border-primary/20 text-foreground">
              <SelectValue placeholder="Selecione a categoria" />
            </SelectTrigger>
            <SelectContent className="bg-card border-primary/20 max-h-[300px]">
              {CATEGORIES.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {t(`category.${cat.id}`)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="url" className="text-foreground">
            URL do Produto *
          </Label>
          <Input
            id="url"
            type="url"
            value={formData.url}
            onChange={(e) => handleInputChange("url", e.target.value)}
            required
            className="bg-background/50 border-primary/20 text-foreground"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="description" className="text-foreground">
            Descrição *
          </Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
            required
            rows={4}
            className="bg-background/50 border-primary/20 text-foreground"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="stock" className="text-foreground flex items-center gap-2">
            {t("form.stock")}
            <HelpCircle className="h-3 w-3 text-muted-foreground" />
          </Label>
          <Input
            id="stock"
            type="number"
            value={formData.stock || ""}
            onChange={(e) => handleInputChange("stock", e.target.value ? Number.parseInt(e.target.value) : 0)}
            placeholder="Deixe em branco se não controlar estoque"
            className="bg-background/50 border-primary/20 text-foreground"
          />
        </div>
      </div>

      {/* Category-specific characteristics */}
      {category && (
        <div className="space-y-4 border-t border-primary/20 pt-6">
          <h3 className="text-lg font-semibold text-primary">Características - {t(`category.${category.id}`)}</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {category.fields.map((field) => (
              <div key={field.name} className="space-y-2">
                <Label htmlFor={field.name} className="text-foreground">
                  {field.label} {field.required && "*"}
                </Label>
                {field.type === "select" ? (
                  <Select
                    value={formData.characteristics?.[field.name] || ""}
                    onValueChange={(value) => handleCharacteristicChange(field.name, value)}
                  >
                    <SelectTrigger className="bg-background/50 border-primary/20 text-foreground">
                      <SelectValue placeholder={`Selecione ${field.label.toLowerCase()}`} />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-primary/20">
                      {field.options?.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : field.type === "textarea" ? (
                  <Textarea
                    id={field.name}
                    value={formData.characteristics?.[field.name] || ""}
                    onChange={(e) => handleCharacteristicChange(field.name, e.target.value)}
                    required={field.required}
                    rows={3}
                    className="bg-background/50 border-primary/20 text-foreground"
                  />
                ) : (
                  <Input
                    id={field.name}
                    type={field.type}
                    value={formData.characteristics?.[field.name] || ""}
                    onChange={(e) => handleCharacteristicChange(field.name, e.target.value)}
                    required={field.required}
                    className="bg-background/50 border-primary/20 text-foreground"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Media Upload */}
      <div className="space-y-4 border-t border-primary/20 pt-6">
        <h3 className="text-lg font-semibold text-primary">Mídias</h3>

        {/* Images */}
        <div className="space-y-2">
          <Label className="text-foreground">Imagens</Label>
          <div
            ref={imageDropRef}
            onDrop={handleImageDrop}
            onDragOver={(e) => e.preventDefault()}
            className="border-2 border-dashed border-primary/20 rounded-lg p-6 text-center hover:border-primary/40 transition-colors"
          >
            <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground mb-2">Arraste imagens aqui ou clique para selecionar</p>
            <label className="cursor-pointer">
              <Button type="button" variant="outline" className="border-primary/20 bg-transparent" asChild>
                <span>Escolher imagens</span>
              </Button>
              <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
            </label>
          </div>
          <div className="flex flex-wrap gap-4 mt-4">
            {imagePreviews.map((preview, index) => (
              <div key={index} className="relative w-24 h-24 rounded border border-primary/20 overflow-hidden">
                <img
                  src={preview || "/placeholder.svg"}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-1 right-1 h-6 w-6"
                  onClick={() => removeImage(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Video */}
        <div className="space-y-2">
          <Label className="text-foreground">Vídeo (opcional)</Label>
          <div
            ref={videoDropRef}
            onDrop={handleVideoDrop}
            onDragOver={(e) => e.preventDefault()}
            className="border-2 border-dashed border-primary/20 rounded-lg p-6 text-center hover:border-primary/40 transition-colors"
          >
            <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground mb-2">Arraste vídeo aqui ou clique para selecionar</p>
            <label className="cursor-pointer">
              <Button type="button" variant="outline" className="border-primary/20 bg-transparent" asChild>
                <span>{videoFile ? "Trocar vídeo" : "Escolher vídeo"}</span>
              </Button>
              <input type="file" accept="video/*" onChange={handleVideoUpload} className="hidden" />
            </label>
            {videoFile && <p className="text-sm text-foreground mt-2">{videoFile.name}</p>}
          </div>
        </div>
      </div>

      {/* Status */}
      <div className="space-y-4 border-t border-primary/20 pt-6">
        <h3 className="text-lg font-semibold text-primary">Status do Produto</h3>
        <div className="space-y-4">
          <div className="flex items-start space-x-3 p-4 rounded-lg bg-background/50 border border-primary/20">
            <Checkbox
              id="published"
              checked={formData.published}
              onCheckedChange={(checked) => handleInputChange("published", checked)}
              className="border-primary/20 mt-1"
            />
            <div className="flex-1">
              <label htmlFor="published" className="text-sm font-medium text-foreground cursor-pointer block">
                {t("form.published")}
              </label>
              <p className="text-xs text-muted-foreground mt-1">{t("form.publishedHelp")}</p>
            </div>
          </div>

          <div className="flex items-start space-x-3 p-4 rounded-lg bg-background/50 border border-primary/20">
            <Checkbox
              id="active"
              checked={formData.active}
              onCheckedChange={(checked) => handleInputChange("active", checked)}
              className="border-primary/20 mt-1"
            />
            <div className="flex-1">
              <label htmlFor="active" className="text-sm font-medium text-foreground cursor-pointer block">
                {t("form.active")}
              </label>
              <p className="text-xs text-muted-foreground mt-1">{t("form.activeHelp")}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-4 pt-4">
        <Button
          type="submit"
          className="bg-primary text-primary-foreground hover:bg-primary/90"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Salvando..." : "Salvar Produto"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="border-primary/20 bg-transparent"
          disabled={isSubmitting}
        >
          Cancelar
        </Button>
      </div>
    </form>
  )
}
