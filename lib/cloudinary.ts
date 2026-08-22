function getCloudinary() {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { v2: cloudinary } = require('cloudinary')

  const cloudinaryUrl = process.env.CLOUDINARY_URL || ''
  const cloudName =
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
    process.env.CLOUDINARY_CLOUD_NAME ||
    ''
  const apiKey = process.env.CLOUDINARY_API_KEY || ''
  const apiSecret = process.env.CLOUDINARY_API_SECRET || ''

  if (cloudinaryUrl) {
    cloudinary.config({
      cloudinary_url: cloudinaryUrl,
      secure: true,
    })
  } else if (cloudName && apiKey && apiSecret) {
    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
      secure: true,
    })
  }

  return cloudinary
}

export function isCloudinaryConfigured(): boolean {
  if (process.env.CLOUDINARY_URL) return true
  const cName =
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
    process.env.CLOUDINARY_CLOUD_NAME
  const key = process.env.CLOUDINARY_API_KEY
  const secret = process.env.CLOUDINARY_API_SECRET
  return !!(cName && key && secret)
}

export function getCloudinaryCloudName(): string {
  return (
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
    process.env.CLOUDINARY_CLOUD_NAME ||
    ''
  )
}

export interface CloudinaryUploadResponse {
  url: string
  secure_url: string
  public_id: string
  format?: string
  width?: number
  height?: number
  bytes?: number
}

/**
 * Uploads an image Buffer, Base64 data URI, or URL to Cloudinary
 */
export async function uploadToCloudinary(
  fileInput: Buffer | string,
  folder: string = 'products',
  customFileName?: string
): Promise<CloudinaryUploadResponse> {
  const cloudinary = getCloudinary()
  const uploadFolder = `verusmart/${folder}`

  if (typeof fileInput === 'string') {
    // Base64 string or remote image URL
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload(
        fileInput,
        {
          folder: uploadFolder,
          resource_type: 'auto',
        },
        (error: any, result: any) => {
          if (error || !result) {
            reject(error || new Error('Cloudinary upload returned empty response.'))
          } else {
            resolve({
              url: result.url,
              secure_url: result.secure_url,
              public_id: result.public_id,
              format: result.format,
              width: result.width,
              height: result.height,
              bytes: result.bytes,
            })
          }
        }
      )
    })
  }

  // Buffer input
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: uploadFolder,
        resource_type: 'auto',
      },
      (error: any, result: any) => {
        if (error || !result) {
          reject(error || new Error('Cloudinary upload stream returned empty response.'))
        } else {
          resolve({
            url: result.url,
            secure_url: result.secure_url,
            public_id: result.public_id,
            format: result.format,
            width: result.width,
            height: result.height,
            bytes: result.bytes,
          })
        }
      }
    )
    stream.end(fileInput)
  })
}

