'use client'

import React, { useState } from 'react'
import { getProductImageUrl } from '@/lib/utils'

interface ProductImageProps {
  src: string | null | undefined
  alt: string
  className?: string
  width?: number
  height?: number
  fallbackSrc?: string
  priority?: boolean
}

export default function ProductImage({
  src,
  alt,
  className = '',
  fallbackSrc = 'https://placehold.jp/300x300.png',
}: ProductImageProps) {
  const [error, setError] = useState(false)
  const initialUrl = getProductImageUrl(src)
  const [imgSrc, setImgSrc] = useState(initialUrl)

  const handleError = () => {
    if (!error) {
      setError(true)
      setImgSrc(fallbackSrc)
    }
  }

  return (
    <img
      src={imgSrc}
      alt={alt || 'Product Image'}
      className={className}
      onError={handleError}
      loading="lazy"
    />
  )
}
