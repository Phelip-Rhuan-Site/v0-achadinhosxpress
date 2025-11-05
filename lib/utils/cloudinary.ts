const CLOUDINARY_CLOUD_NAME = "dioq9c5ul"
const CLOUDINARY_UPLOAD_PRESET = "public_upload"
const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`

export interface CloudinaryUploadResponse {
  secure_url: string
  public_id: string
  width: number
  height: number
  format: string
  resource_type: string
  created_at: string
  bytes: number
  url: string
}

/**
 * Upload an image file to Cloudinary
 * @param file - The image file to upload
 * @returns Promise with the secure URL of the uploaded image
 */
export async function uploadImageToCloudinary(file: File): Promise<string> {
  console.log("[v0] Uploading image to Cloudinary:", file.name)

  // Validate file type
  if (!file.type.startsWith("image/")) {
    throw new Error(`Arquivo "${file.name}" deve ser uma imagem.`)
  }

  // Validate file size (max 10MB for Cloudinary free tier)
  const maxSize = 10 * 1024 * 1024 // 10MB
  if (file.size > maxSize) {
    throw new Error(`Imagem "${file.name}" muito grande. Máximo 10MB por imagem.`)
  }

  try {
    const formData = new FormData()
    formData.append("file", file)
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET)

    const response = await fetch(CLOUDINARY_UPLOAD_URL, {
      method: "POST",
      body: formData,
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error("[v0] Cloudinary upload error:", errorData)
      throw new Error(`Erro ao fazer upload da imagem "${file.name}": ${response.statusText}`)
    }

    const data: CloudinaryUploadResponse = await response.json()
    console.log("[v0] Image uploaded successfully:", data.secure_url)

    return data.secure_url
  } catch (error) {
    console.error("[v0] Error uploading to Cloudinary:", error)
    if (error instanceof Error) {
      throw error
    }
    throw new Error(`Erro ao fazer upload da imagem "${file.name}"`)
  }
}

/**
 * Upload multiple images to Cloudinary in parallel
 * @param files - Array of image files to upload
 * @returns Promise with array of secure URLs
 */
export async function uploadMultipleImagesToCloudinary(files: File[]): Promise<string[]> {
  console.log(`[v0] Uploading ${files.length} images to Cloudinary...`)

  const uploadPromises = files.map((file) => uploadImageToCloudinary(file))

  try {
    const urls = await Promise.all(uploadPromises)
    console.log(`[v0] All ${files.length} images uploaded successfully`)
    return urls
  } catch (error) {
    console.error("[v0] Error uploading multiple images:", error)
    throw error
  }
}

/**
 * Upload a video file to Cloudinary
 * @param file - The video file to upload
 * @returns Promise with the secure URL of the uploaded video
 */
export async function uploadVideoToCloudinary(file: File): Promise<string> {
  console.log("[v0] Uploading video to Cloudinary:", file.name)

  // Validate file type
  if (!file.type.startsWith("video/")) {
    throw new Error(`Arquivo "${file.name}" deve ser um vídeo.`)
  }

  // Validate file size (max 100MB for videos)
  const maxSize = 100 * 1024 * 1024 // 100MB
  if (file.size > maxSize) {
    throw new Error(`Vídeo "${file.name}" muito grande. Máximo 100MB.`)
  }

  try {
    const formData = new FormData()
    formData.append("file", file)
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET)
    formData.append("resource_type", "video")

    // Use video endpoint
    const videoUploadUrl = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/video/upload`

    const response = await fetch(videoUploadUrl, {
      method: "POST",
      body: formData,
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error("[v0] Cloudinary video upload error:", errorData)
      throw new Error(`Erro ao fazer upload do vídeo "${file.name}": ${response.statusText}`)
    }

    const data: CloudinaryUploadResponse = await response.json()
    console.log("[v0] Video uploaded successfully:", data.secure_url)

    return data.secure_url
  } catch (error) {
    console.error("[v0] Error uploading video to Cloudinary:", error)
    if (error instanceof Error) {
      throw error
    }
    throw new Error(`Erro ao fazer upload do vídeo "${file.name}"`)
  }
}
