"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { type User, onAuthStateChanged } from "firebase/auth"
import { auth } from "@/lib/firebase/config"
import { getUserRole } from "@/lib/firebase/auth-helpers"

interface AuthContextType {
  user: User | null
  userRole: string | null
  loading: boolean
  isAdmin: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userRole: null,
  loading: true,
  isAdmin: false,
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [userRole, setUserRole] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log("[v0] Auth state changed, user:", user?.email || "none")
      setUser(user)

      if (user?.email) {
        const cachedRole = localStorage.getItem(`userRole_${user.email}`)
        if (cachedRole) {
          console.log("[v0] Using cached role:", cachedRole)
          setUserRole(cachedRole)
        }

        console.log("[v0] Fetching role from Firestore for:", user.email)
        try {
          const role = await Promise.race([
            getUserRole(user.email),
            new Promise<null>((resolve) =>
              setTimeout(() => {
                console.log("[v0] Role fetch timeout after 5 seconds")
                resolve(null)
              }, 5000),
            ),
          ])

          console.log("[v0] Role fetched:", role)

          if (role) {
            setUserRole(role)
            localStorage.setItem(`userRole_${user.email}`, role)
          } else if (!cachedRole) {
            console.log("[v0] No role found and no cache available")
            setUserRole(null)
          }
        } catch (error) {
          console.error("[v0] Error fetching role:", error)
          if (!cachedRole) {
            setUserRole(null)
          }
        }
      } else {
        setUserRole(null)
        localStorage.removeItem(`userRole_${user?.email}`)
      }

      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const isAdmin = userRole === "ADM Master" || userRole?.includes("ADM") || false

  useEffect(() => {
    console.log("[v0] Auth state - userRole:", userRole, "isAdmin:", isAdmin)
  }, [userRole, isAdmin])

  return <AuthContext.Provider value={{ user, userRole, loading, isAdmin }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
