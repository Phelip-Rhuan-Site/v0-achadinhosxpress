"use client"

import { useEffect, useState } from "react"
import { getMessagingInstance, VAPID_PUBLIC_KEY } from "@/lib/firebase/config"
import { getToken, onMessage } from "firebase/messaging"
import { doc, setDoc } from "firebase/firestore"
import { db } from "@/lib/firebase/config"
import { useAuth } from "@/lib/contexts/auth-context"

export function useFCM() {
  const [token, setToken] = useState<string | null>(null)
  const [permission, setPermission] = useState<NotificationPermission>("default")
  const { user } = useAuth()

  useEffect(() => {
    if (typeof window === "undefined" || !user) return

    const setupFCM = async () => {
      try {
        const messaging = await getMessagingInstance()
        if (!messaging) return

        // Request permission
        const permission = await Notification.requestPermission()
        setPermission(permission)

        if (permission === "granted") {
          // Get FCM token
          const currentToken = await getToken(messaging, {
            vapidKey: VAPID_PUBLIC_KEY,
          })

          if (currentToken) {
            setToken(currentToken)

            // Save token to Firestore
            await setDoc(doc(db, "fcmTokens", user.uid), {
              token: currentToken,
              userId: user.uid,
              email: user.email,
              updatedAt: new Date(),
            })
          }
        }

        // Handle foreground messages
        onMessage(messaging, (payload) => {
          console.log("Message received:", payload)

          if (payload.notification) {
            new Notification(payload.notification.title || "Achadinhos Xpress", {
              body: payload.notification.body,
              icon: "/icon-192.jpg",
            })
          }
        })
      } catch (error) {
        console.error("Error setting up FCM:", error)
      }
    }

    setupFCM()
  }, [user])

  return { token, permission }
}
