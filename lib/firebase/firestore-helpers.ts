import { doc, getDoc, setDoc, type DocumentData } from "firebase/firestore"
import { db } from "./config"

export async function checkFirestoreConnection(): Promise<boolean> {
  try {
    console.log("[v0] Checking Firestore connection...")
    const testDoc = doc(db, "_connection_test_", "test")
    await getDoc(testDoc)
    console.log("[v0] Firestore connection successful")
    return true
  } catch (error: any) {
    console.error("[v0] Firestore connection failed:", error.code, error.message)

    if (error.code === "unavailable") {
      console.error("[v0] Firestore is unavailable. Please check:")
      console.error("1. Is Firestore enabled in Firebase Console?")
      console.error("2. Go to: https://console.firebase.google.com/project/achadinhos-xpress/firestore")
      console.error("3. Click 'Create Database' if you haven't already")
      console.error("4. Choose 'Start in production mode' or 'Start in test mode'")
    }

    return false
  }
}

export async function safeGetDoc(docPath: string, docId: string, timeoutMs = 5000) {
  try {
    const docRef = doc(db, docPath, docId)

    // Create a timeout promise
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error("Firestore request timeout")), timeoutMs)
    })

    // Race between the actual request and timeout
    const docSnap = (await Promise.race([getDoc(docRef), timeoutPromise])) as any

    if (docSnap.exists()) {
      console.log(`[v0] Document ${docPath}/${docId} fetched successfully`)
      return docSnap.data()
    } else {
      console.log(`[v0] Document ${docPath}/${docId} does not exist`)
      return null
    }
  } catch (error: any) {
    console.error(`[v0] Error fetching ${docPath}/${docId}:`, error.message)
    throw error
  }
}

export async function safeSetDoc(docPath: string, docId: string, data: DocumentData) {
  try {
    const docRef = doc(db, docPath, docId)
    await setDoc(docRef, data, { merge: true })
    console.log(`[v0] Document ${docPath}/${docId} saved successfully`)
    return true
  } catch (error: any) {
    console.error(`[v0] Error saving ${docPath}/${docId}:`, error.message)
    throw error
  }
}
