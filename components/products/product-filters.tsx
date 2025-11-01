"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useLanguage } from "@/lib/contexts/language-context"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { STORES } from "@/lib/types/product"
import { CATEGORIES } from "@/lib/types/categories"
import { Filter, SlidersHorizontal } from "lucide-react"

interface ProductFiltersProps {
  selectedStores: string[]
  selectedCategories: string[]
  sortBy: string
  onStoresChange: (stores: string[]) => void
  onCategoriesChange: (categories: string[]) => void
  onSortChange: (sort: string) => void
  onClearFilters: () => void
}

export function ProductFilters({
  selectedStores,
  selectedCategories,
  sortBy,
  onStoresChange,
  onCategoriesChange,
  onSortChange,
  onClearFilters,
}: ProductFiltersProps) {
  const [open, setOpen] = useState(false)
  const { t } = useLanguage()

  const handleStoreToggle = (store: string) => {
    if (selectedStores.includes(store)) {
      onStoresChange(selectedStores.filter((s) => s !== store))
    } else {
      onStoresChange([...selectedStores, store])
    }
  }

  const handleCategoryToggle = (category: string) => {
    if (selectedCategories.includes(category)) {
      onCategoriesChange(selectedCategories.filter((c) => c !== category))
    } else {
      onCategoriesChange([...selectedCategories, category])
    }
  }

  const activeFiltersCount = selectedStores.length + selectedCategories.length

  return (
    <div className="flex items-center gap-4 mb-6">
      {/* Sort Dropdown */}
      <Select value={sortBy} onValueChange={onSortChange}>
        <SelectTrigger className="w-[200px] bg-background/50 border-primary/20 text-foreground">
          <SlidersHorizontal className="mr-2 h-4 w-4" />
          <SelectValue placeholder={t("home.sortBy")} />
        </SelectTrigger>
        <SelectContent className="bg-card border-primary/20">
          <SelectItem value="recent">{t("home.sortRecent")}</SelectItem>
          <SelectItem value="price-asc">{t("home.sortPriceLow")}</SelectItem>
          <SelectItem value="price-desc">{t("home.sortPriceHigh")}</SelectItem>
          <SelectItem value="views">{t("home.sortViews")}</SelectItem>
        </SelectContent>
      </Select>

      {/* Filters Sheet */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" className="border-primary/20 text-foreground hover:bg-primary/10 bg-transparent">
            <Filter className="mr-2 h-4 w-4" />
            {t("home.filters")}
            {activeFiltersCount > 0 && (
              <span className="ml-2 px-2 py-0.5 text-xs bg-primary text-primary-foreground rounded-full">
                {activeFiltersCount}
              </span>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent className="bg-card border-primary/20 overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="text-primary">{t("home.filters")}</SheetTitle>
            <SheetDescription className="text-muted-foreground">
              {t("home.stores")} {t("home.categories").toLowerCase()}
            </SheetDescription>
          </SheetHeader>

          <div className="mt-6 space-y-6">
            {/* Stores Filter */}
            <div>
              <Label className="text-base font-semibold text-foreground mb-3 block">{t("home.stores")}</Label>
              <div className="space-y-3">
                {STORES.map((store) => (
                  <div key={store} className="flex items-center space-x-2">
                    <Checkbox
                      id={`store-${store}`}
                      checked={selectedStores.includes(store)}
                      onCheckedChange={() => handleStoreToggle(store)}
                      className="border-primary/20"
                    />
                    <label htmlFor={`store-${store}`} className="text-sm text-foreground cursor-pointer">
                      {store}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Categories Filter */}
            <div>
              <Label className="text-base font-semibold text-foreground mb-3 block">{t("home.categories")}</Label>
              <div className="space-y-3">
                {CATEGORIES.map((category) => (
                  <div key={category.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`category-${category.id}`}
                      checked={selectedCategories.includes(category.id)}
                      onCheckedChange={() => handleCategoryToggle(category.id)}
                      className="border-primary/20"
                    />
                    <label htmlFor={`category-${category.id}`} className="text-sm text-foreground cursor-pointer">
                      {t(`category.${category.id}`)}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Clear Filters */}
            {activeFiltersCount > 0 && (
              <Button
                variant="outline"
                className="w-full border-destructive/20 text-destructive hover:bg-destructive/10 bg-transparent"
                onClick={() => {
                  onClearFilters()
                  setOpen(false)
                }}
              >
                {t("home.clearFilters")}
              </Button>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
