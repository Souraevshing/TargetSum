export const priceDisplay = price => {
  const displayPrice = price.toLocaleString('en-IN', {
    maximumFractionDigits: 2,
    style: 'currency',
    currency: 'INR',
  });
  return displayPrice;
};
