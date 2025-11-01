"use client"

import { useEffect } from "react"
import { doc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase/config"

export function FaviconUpdater() {
  useEffect(() => {
    const updateFavicon = async () => {
      try {
        console.log("[v0] Fetching favicon from config...")
        const configDoc = await getDoc(doc(db, "meta", "config"))

        if (configDoc.exists()) {
          const data = configDoc.data()
          const faviconUrl = data.faviconUrl

          if (faviconUrl) {
            console.log("[v0] Updating favicon to:", faviconUrl.substring(0, 50) + "...")

            // Update all favicon link elements
            const links = document.querySelectorAll("link[rel*='icon']")
            links.forEach((link) => {
              ;(link as HTMLLinkElement).href = faviconUrl
            })

            // Update apple touch icon
            const appleTouchIcon = document.querySelector("link[rel='apple-touch-icon']")
            if (appleTouchIcon) {
              ;(appleTouchIcon as HTMLLinkElement).href = faviconUrl
            }

            console.log("[v0] Favicon updated successfully")
          } else {
            console.log("[v0] No favicon URL in config")
          }
        }
      } catch (error) {
        console.error("[v0] Error updating favicon:", error)
      }
    }

    updateFavicon()
  }, [])

  return null
}
