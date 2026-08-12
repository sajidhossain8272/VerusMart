/**
 * Format date consistently on both server and client to prevent React hydration errors (Error #418).
 */
export function formatDate(dateInput: string | Date | number | null | undefined): string {
  if (!dateInput) return 'N/A'
  const d = new Date(dateInput)
  if (isNaN(d.getTime())) return 'N/A'
  
  // Using explicit 'en-US' locale with specified options produces exact same string on Node SSR and client browser
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

/**
 * Format price in BDT currency (৳)
 */
export function formatCurrency(amount: number | string | null | undefined): string {
  const num = typeof amount === 'number' ? amount : parseFloat(String(amount || 0))
  const validNum = isNaN(num) ? 0 : num
  return `৳${validNum.toLocaleString('en-BD')}`
}
