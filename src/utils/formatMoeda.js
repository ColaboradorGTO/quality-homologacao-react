export function formatMoeda(value, locale = "pt-BR", currency = 'BRL') {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(value);
}