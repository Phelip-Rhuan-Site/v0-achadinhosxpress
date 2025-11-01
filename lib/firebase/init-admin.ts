import { doc, setDoc } from "firebase/firestore"
import { db } from "./config"

/**
 * Script to initialize the first admin user
 * Run this once to create your first admin account
 */
export async function initializeFirstAdmin(email: string) {
  try {
    await setDoc(doc(db, "invites", email), {
      email,
      role: "ADM Master",
      createdAt: new Date(),
      createdBy: "system",
    })
    console.log(`Admin created successfully for ${email}`)
    return { success: true }
  } catch (error) {
    console.error("Error creating admin:", error)
    return { success: false, error }
  }
}
