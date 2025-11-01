import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  sendEmailVerification,
  type User,
} from "firebase/auth"
import { doc, getDoc, setDoc } from "firebase/firestore"
import { auth, db } from "./config"

export interface UserRole {
  email: string
  role: string
  createdAt: Date
  createdBy?: string
}

// Map Firebase auth errors to Portuguese
export function mapAuthError(code: string): string {
  const errors: Record<string, string> = {
    "auth/email-already-in-use": "Este e-mail já está em uso",
    "auth/invalid-email": "E-mail inválido",
    "auth/operation-not-allowed": "Operação não permitida",
    "auth/weak-password": "Senha muito fraca (mínimo 6 caracteres)",
    "auth/user-disabled": "Usuário desabilitado",
    "auth/user-not-found": "Usuário não encontrado",
    "auth/wrong-password": "Senha incorreta",
    "auth/too-many-requests": "Muitas tentativas. Tente novamente mais tarde",
    "auth/network-request-failed": "Erro de conexão. Verifique sua internet",
  }
  return errors[code] || "Erro desconhecido. Tente novamente"
}

// Login
export async function loginUser(email: string, password: string) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    return { user: userCredential.user, error: null }
  } catch (error: any) {
    return { user: null, error: mapAuthError(error.code) }
  }
}

// Create account
export async function createAccount(email: string, password: string) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    await sendEmailVerification(userCredential.user)
    return { user: userCredential.user, error: null }
  } catch (error: any) {
    return { user: null, error: mapAuthError(error.code) }
  }
}

// Reset password
export async function resetPassword(email: string) {
  try {
    await sendPasswordResetEmail(auth, email)
    return { success: true, error: null }
  } catch (error: any) {
    return { success: false, error: mapAuthError(error.code) }
  }
}

// Logout
export async function logoutUser() {
  try {
    await signOut(auth)
    localStorage.removeItem("userRole")
    return { success: true, error: null }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

// Check user role from invites collection
export async function getUserRole(email: string): Promise<string | null> {
  try {
    console.log("[v0] Fetching role for email:", email)
    const inviteDoc = await getDoc(doc(db, "invites", email))
    if (inviteDoc.exists()) {
      const data = inviteDoc.data() as UserRole
      console.log("[v0] Role found:", data.role)
      // Cache role in localStorage
      localStorage.setItem("userRole", data.role)
      return data.role
    }
    console.log("[v0] No role found for email:", email)
    localStorage.removeItem("userRole")
    return null
  } catch (error: any) {
    console.error("[v0] Error fetching user role:", error)
    console.error("[v0] Error code:", error?.code)
    console.error("[v0] Error message:", error?.message)
    return null
  }
}

// Check if user is admin
export async function isAdmin(user: User | null): Promise<boolean> {
  if (!user?.email) return false

  // Check cache first
  const cachedRole = localStorage.getItem("userRole")
  if (cachedRole === "ADM Master") return true

  const role = await getUserRole(user.email)
  return role === "ADM Master" || role?.includes("ADM") || false
}

// Add admin invite
export async function addAdminInvite(email: string, role: string, createdBy: string) {
  try {
    await setDoc(doc(db, "invites", email), {
      email,
      role,
      createdAt: new Date(),
      createdBy,
    })
    return { success: true, error: null }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}
