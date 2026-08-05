'use client'

import React, { useState } from 'react'

interface ReviewItem {
  id: number
  rating: number
  comment: string | null
  created_at: string | Date | null
  user?: { full_name: string } | null
}

interface Props {
  productId: number
  initialReviews: ReviewItem[]
}

export default function ReviewSection({ productId, initialReviews }: Props) {
  const [reviews, setReviews] = useState<ReviewItem[]>(initialReviews)
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [msg, setMsg] = useState({ type: '', text: '' })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setMsg({ type: '', text: '' })

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, rating, comment })
      })

      const data = await res.json()
      if (data.success) {
        setReviews(prev => [data.review, ...prev])
        setComment('')
        setMsg({ type: 'success', text: 'Thank you! Your review has been published.' })
      } else {
        setMsg({ type: 'error', text: data.error || 'Failed to submit review. Make sure you are logged in.' })
      }
    } catch {
      setMsg({ type: 'error', text: 'Network error while submitting review.' })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-200/80 mb-8">
      <div className="border-b border-gray-100 pb-4 mb-6 flex items-center justify-between">
        <h3 className="text-base sm:text-lg font-black text-[#002b5b] uppercase tracking-wide flex items-center gap-2">
          <span className="text-amber-400">⭐</span> Customer Reviews ({reviews.length})
        </h3>
      </div>

      {msg.text && (
        <div className={`p-3 rounded-xl text-xs font-bold mb-6 ${
          msg.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {msg.text}
        </div>
      )}

      {/* Review Submission Form */}
      <form onSubmit={handleSubmit} className="bg-gray-50 border border-gray-100 p-5 rounded-2xl mb-8 space-y-4">
        <h4 className="text-xs font-black text-[#002b5b] uppercase tracking-wider">Leave a Review & Rating</h4>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-gray-700">Rating:</span>
          {[1, 2, 3, 4, 5].map(star => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className={`text-lg cursor-pointer transition-transform hover:scale-125 ${
                star <= rating ? 'text-amber-400' : 'text-gray-300'
              }`}
            >
              ★
            </button>
          ))}
        </div>
        <textarea
          rows={3}
          value={comment}
          onChange={e => setComment(e.target.value)}
          placeholder="Write your honest review about this product..."
          className="w-full border border-gray-200 rounded-xl p-3 text-xs outline-none focus:border-[#f85606] bg-white font-medium text-gray-800"
        />
        <button
          type="submit"
          disabled={submitting}
          className="px-6 py-2.5 bg-[#002b5b] hover:bg-[#f85606] text-white font-black text-xs rounded-xl transition-all cursor-pointer shadow-md disabled:opacity-50"
        >
          {submitting ? 'Submitting...' : 'Submit Review'}
        </button>
      </form>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <p className="text-xs text-gray-400 font-bold text-center py-4">No reviews yet. Be the first to write a review!</p>
        ) : (
          reviews.map(r => (
            <div key={r.id} className="border-b border-gray-100 last:border-0 pb-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-gray-900">{r.user?.full_name || 'Verified Customer'}</span>
                <span className="text-amber-400 text-xs font-black">{"★".repeat(r.rating)}</span>
              </div>
              <p className="text-xs text-gray-700 leading-relaxed">{r.comment}</p>
              <span className="text-[10px] text-gray-400 mt-1 block">
                {r.created_at ? new Date(r.created_at).toLocaleDateString() : ''}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
