export function getTotalItems(items: { quantity: number }[]): number {
  return items.reduce((total, item) => total + item.quantity, 0);
}
