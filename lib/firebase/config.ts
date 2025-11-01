import { initializeApp, getApps } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore, enableIndexedDbPersistence } from "firebase/firestore"
import { getStorage } from "firebase/storage"
import { getAnalytics, isSupported } from "firebase/analytics"
import { getMessaging, isSupported as isMessagingSupported } from "firebase/messaging"

const firebaseConfig = {
  apiKey: "AIzaSyBGrJMiZ9GhhyRNvZaRhvIgSuMGc2QzcgY",
  authDomain: "achadinhos-xpress.firebaseapp.com",
  projectId: "achadinhos-xpress",
  storageBucket: "achadinhos-xpress.firebasestorage.app",
  messagingSenderId: "684166159289",
  appId: "1:684166159289:web:47ae8c6910874ee830f468",
  measurementId: "G-562WTBNC9R",
}

export const VAPID_PUBLIC_KEY =
  "BGedF6Bb64mPdWo-n9iG5pYJ5sPd_GUatBPrHL7PGoU9GCB26roLAUkB0mMq3dFr1J4sz74_ekMonyk62t-eqGY"

let app
try {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
  console.log("[v0] Firebase app initialized successfully")
} catch (error) {
  console.error("[v0] Firebase initialization error:", error)
  app = getApps()[0] || initializeApp(firebaseConfig)
}

export const auth = getAuth(app)

export const db = getFirestore(app)

// Enable offline persistence for better UX
if (typeof window !== "undefined") {
  enableIndexedDbPersistence(db).catch((err) => {
    if (err.code === "failed-precondition") {
      console.warn("[v0] Firestore persistence failed: Multiple tabs open")
    } else if (err.code === "unimplemented") {
      console.warn("[v0] Firestore persistence not available in this browser")
    }
  })
}

export const storage = getStorage(app)

// Analytics (only in browser)
export const getAnalyticsInstance = async () => {
  if (typeof window !== "undefined") {
    try {
      const supported = await isSupported()
      if (supported) {
        return getAnalytics(app)
      }
    } catch (error) {
      console.error("Analytics not supported:", error)
    }
  }
  return null
}

// Messaging (only in browser)
export const getMessagingInstance = async () => {
  if (typeof window !== "undefined") {
    try {
      const supported = await isMessagingSupported()
      if (supported) {
        return getMessaging(app)
      }
    } catch (error) {
      console.error("Messaging not supported:", error)
    }
  }
  return null
}

export { app }
