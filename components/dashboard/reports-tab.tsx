"use client"

import { useState, useEffect } from "react"
import { collection, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase/config"
import type { Product } from "@/lib/types/product"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts"

export function ReportsTab() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

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
    } finally {
      setLoading(false)
    }
  }

  // Calculate statistics
  const totalProducts = products.length
  const publishedProducts = products.filter((p) => p.published).length
  const activeProducts = products.filter((p) => p.active).length
  const totalViews = products.reduce((sum, p) => sum + (p.views || 0), 0)
  const totalValue = products.reduce((sum, p) => sum + p.price, 0)

  // Products by store
  const productsByStore = products.reduce(
    (acc, product) => {
      acc[product.store] = (acc[product.store] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const storeData = Object.entries(productsByStore).map(([name, value]) => ({
    name,
    value,
  }))

  // Products by category
  const productsByCategory = products.reduce(
    (acc, product) => {
      acc[product.category] = (acc[product.category] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const categoryData = Object.entries(productsByCategory)
    .map(([name, value]) => ({
      name,
      value,
    }))
    .slice(0, 10) // Top 10 categories

  // Metrics for radar chart
  const metricsData = [
    {
      metric: "Total",
      value: totalProducts,
      fullMark: Math.max(totalProducts, 100),
    },
    {
      metric: "Publicados",
      value: publishedProducts,
      fullMark: totalProducts,
    },
    {
      metric: "Ativos",
      value: activeProducts,
      fullMark: totalProducts,
    },
    {
      metric: "Views",
      value: Math.min(totalViews, 1000),
      fullMark: 1000,
    },
  ]

  // Colors for charts (gold theme)
  const COLORS = ["#d4af37", "#c5a028", "#b69121", "#a7821a", "#987313", "#89640c", "#7a5505"]

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-primary/20 bg-card/50 backdrop-blur">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total de Produtos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{totalProducts}</div>
          </CardContent>
        </Card>

        <Card className="border-primary/20 bg-card/50 backdrop-blur">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Publicados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{publishedProducts}</div>
          </CardContent>
        </Card>

        <Card className="border-primary/20 bg-card/50 backdrop-blur">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total de Views</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{totalViews.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card className="border-primary/20 bg-card/50 backdrop-blur">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Valor Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">R$ {totalValue.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart - Products by Store */}
        <Card className="border-primary/20 bg-card/50 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-primary">Produtos por Loja</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={storeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {storeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid #d4af37" }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Bar Chart - Products by Category */}
        <Card className="border-primary/20 bg-card/50 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-primary">Top 10 Categorias</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis
                  dataKey="name"
                  tick={{ fill: "#d4af37", fontSize: 10 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis tick={{ fill: "#d4af37" }} />
                <Tooltip contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid #d4af37" }} />
                <Bar dataKey="value" fill="#d4af37" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Radar Chart - Metrics */}
        <Card className="border-primary/20 bg-card/50 backdrop-blur lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-primary">Métricas Gerais</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={metricsData}>
                <PolarGrid stroke="#333" />
                <PolarAngleAxis dataKey="metric" tick={{ fill: "#d4af37" }} />
                <PolarRadiusAxis tick={{ fill: "#d4af37" }} />
                <Radar name="Métricas" dataKey="value" stroke="#d4af37" fill="#d4af37" fillOpacity={0.6} />
                <Tooltip contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid #d4af37" }} />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Products by Views */}
      <Card className="border-primary/20 bg-card/50 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-primary">Produtos Mais Vistos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {products
              .sort((a, b) => (b.views || 0) - (a.views || 0))
              .slice(0, 10)
              .map((product, index) => (
                <div key={product.id} className="flex items-center justify-between py-2 border-b border-primary/10">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-bold text-primary/50">{index + 1}</span>
                    <div>
                      <p className="font-medium text-foreground">{product.name}</p>
                      <p className="text-sm text-muted-foreground">{product.store}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-primary">{product.views || 0} views</p>
                    <p className="text-sm text-muted-foreground">R$ {product.price.toFixed(2)}</p>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
