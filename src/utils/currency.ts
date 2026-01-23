export const formatPrice = (price: string | number, locale: string = 'pt-BR'): string => {
  if (price === undefined || price === null) return 'R$ 0,00';
  if (typeof price === 'string' && (price.includes('R$') || price.includes('$'))) return price;

  const numPrice = typeof price === 'string' ? parseFloat(price) : price;

  return isNaN(numPrice)
    ? price.toString()
    : new Intl.NumberFormat(locale, { style: 'currency', currency: 'BRL' }).format(numPrice);
};
