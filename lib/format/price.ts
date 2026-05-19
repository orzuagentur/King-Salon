export function formatPrice(price: number) {
  return new Intl.NumberFormat("de-DE", {
    currency: "EUR",
    style: "currency",
  }).format(price);
}

export function formatPriceLabel(price: number) {
  if (price <= 0) {
    return "Preis im Salon";
  }

  return formatPrice(price);
}
