'use client'

import React, { useState, useTransition } from 'react'
import Link from 'next/link'
import { submitContactMessage } from './actions'

export default function ContactPage() {
  const [isPending, startTransition] = useTransition()
  const [status, setStatus] = useState<{ type: 'success' | 'error' | '', text: string }>({ type: '', text: '' })

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const formData = new FormData(form)

    startTransition(async () => {
      const res = await submitContactMessage(formData)
      if (res.success) {
        setStatus({ type: 'success', text: 'Thank you! Your message has been sent successfully. We will get back to you shortly.' })
        form.reset()
      } else {
        setStatus({ type: 'error', text: res.error || 'Something went wrong. Please try again.' })
      }
    })
  }

  return (
    <div className="w-[92%] max-w-[1000px] mx-auto py-[40px] font-sans">
      <div className="text-[13px] text-[#757575] mb-[15px] font-medium">
        <Link href="/" className="text-[#1a9cb7] hover:underline">Home</Link> &gt; <span className="text-[#212121]">Contact Us</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-[30px]">
        {/* Contact Info Column */}
        <div className="bg-white rounded-2xl p-[30px] md:p-[40px] shadow-[0_2px_12px_rgba(0,0,0,0.05)] border border-[#eee] flex flex-col justify-between">
          <div>
            <h1 className="text-[28px] font-black text-[#002b5b] mb-[20px] uppercase tracking-wide border-b-2 border-[#f85606] pb-[10px] w-fit">
              Contact Us
            </h1>
            <p className="text-[#666] text-[14px] leading-[1.8] mb-[30px]">
              Have queries, feedback, or business proposals? Drop us a message, and our customer response team will contact you within 24 hours.
            </p>

            <div className="space-y-[20px]">
              <div className="flex items-start gap-[15px]">
                <div className="w-[40px] h-[40px] rounded-full bg-[#fff6f2] text-[#f85606] flex items-center justify-center shrink-0">
                  <i className="fa-solid fa-location-dot"></i>
                </div>
                <div>
                  <h4 className="font-bold text-[#212121] text-[15px] mb-[3px]">Corporate Address</h4>
                  <p className="text-[#666] text-[13px] leading-[1.5]">
                    Verus Mart Corporate Headquarters<br />
                    Kawla, Dhaka - 1229, Bangladesh
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-[15px]">
                <div className="w-[40px] h-[40px] rounded-full bg-[#fff6f2] text-[#f85606] flex items-center justify-center shrink-0">
                  <i className="fa-solid fa-phone"></i>
                </div>
                <div>
                  <h4 className="font-bold text-[#212121] text-[15px] mb-[3px]">Phone Support</h4>
                  <p className="text-[#666] text-[13px] leading-[1.5]">
                    +880 1628083370 (Everyday, 9 AM to 10 PM)
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-[15px]">
                <div className="w-[40px] h-[40px] rounded-full bg-[#fff6f2] text-[#f85606] flex items-center justify-center shrink-0">
                  <i className="fa-solid fa-envelope"></i>
                </div>
                <div>
                  <h4 className="font-bold text-[#212121] text-[15px] mb-[3px]">Email Inquiries</h4>
                  <p className="text-[#666] text-[13px] leading-[1.5]">
                    verusmart4@gmail.com
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#fff6f2] p-[15px] rounded-xl border border-[#ffe1d2] mt-[30px]">
            <span className="font-bold text-[13px] text-[#f85606] uppercase tracking-wider block mb-[4px]">🚚 Delivery Locations</span>
            <p className="text-[#555] text-[12px] leading-[1.5]">
              Currently serving Dhaka and all 64 districts of Bangladesh with fast shipping.
            </p>
          </div>
        </div>

        {/* Contact Form Column */}
        <div className="bg-white rounded-2xl p-[30px] md:p-[40px] shadow-[0_2px_12px_rgba(0,0,0,0.05)] border border-[#eee]">
          <h3 className="text-[20px] font-bold text-[#002b5b] mb-[20px]">Send us a message</h3>
          
          {status.text && (
            <div className={`p-4 mb-5 rounded-lg text-xs font-semibold ${status.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {status.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-[15px]">
            <div>
              <label className="text-[13px] font-semibold text-gray-700 block mb-[6px]">Your Name *</label>
              <input 
                type="text" 
                name="name" 
                required 
                className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-[#f85606] text-sm"
                placeholder="e.g. Tanvir Rahman"
              />
            </div>

            <div>
              <label className="text-[13px] font-semibold text-gray-700 block mb-[6px]">Email Address *</label>
              <input 
                type="email" 
                name="email" 
                required 
                className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-[#f85606] text-sm"
                placeholder="e.g. tanvir@gmail.com"
              />
            </div>

            <div>
              <label className="text-[13px] font-semibold text-gray-700 block mb-[6px]">Subject</label>
              <input 
                type="text" 
                name="subject" 
                className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-[#f85606] text-sm"
                placeholder="e.g. Pre-sales query"
              />
            </div>

            <div>
              <label className="text-[13px] font-semibold text-gray-700 block mb-[6px]">Your Message *</label>
              <textarea 
                name="message" 
                required 
                rows={4}
                className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-[#f85606] text-sm"
                placeholder="Write your message details here..."
              />
            </div>

            <button 
              type="submit" 
              disabled={isPending}
              className="w-full bg-[#f85606] hover:bg-[#d04300] disabled:bg-gray-400 text-white font-bold text-sm py-3 px-6 rounded-lg transition-colors shadow-sm"
            >
              {isPending ? 'Sending Message...' : 'Submit Message'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
