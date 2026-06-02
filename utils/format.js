export function formatPrice(amt, cur = "EUR") {
  try {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: cur,
    }).format(Number(amt ?? 0));
  } catch {
    return `${amt} ${cur}`;
  }
}
