export function formatMoeda(value, locale = "pt-BR", currency = 'BRL') {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(value);
}

export function formatarMoeda (valor) {
  const apenasNumeros = valor.replace(/\D/g, '');
  if (!apenasNumeros) return '';
  if (apenasNumeros.length <= 2) return apenasNumeros;
  
  const centavos = apenasNumeros.slice(-2);
  const inteiros = apenasNumeros.slice(0, -2);
  
  const integrosFormatado = inteiros.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  
  return integrosFormatado + '.' + centavos;
};