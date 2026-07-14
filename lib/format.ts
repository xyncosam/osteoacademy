export function formatPrice(cents: number): string {
  const dollars = cents / 100
  const hasCents = cents % 100 !== 0

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: hasCents ? 2 : 0,
    maximumFractionDigits: hasCents ? 2 : 0,
  }).format(dollars)
}
