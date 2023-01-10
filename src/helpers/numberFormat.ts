export const formatMoney = (value: number | string) =>
  new Intl.NumberFormat('pt-PT', {
    style: 'currency',
    currency: 'AOA',
  }).format(Number(value ?? 0));

export const formatNumber = (value: number | string) =>
  Number(value ?? 0).toFixed(2);
