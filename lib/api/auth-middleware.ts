import type { NextRequest } from "next/server"

export function validateApiKey(request: NextRequest): boolean {
  const authHeader = request.headers.get("authorization")

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return false
  }

  const token = authHeader.substring(7) // Remove 'Bearer ' prefix
  const apiKey = process.env.API_SECRET_KEY

  if (!apiKey) {
    console.error("[v0] API_SECRET_KEY not configured in environment variables")
    return false
  }

  return token === apiKey
}

export function unauthorizedResponse() {
  return Response.json({ ok: false, mensagem: "Não autorizado. Token inválido ou ausente." }, { status: 401 })
}
