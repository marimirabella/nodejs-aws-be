export const getAddStockQueryValues = (productIds: Record<string, string>[]) => {
  const productIdList = productIds.map(({ id }) => id);
  
  const countList = [...Array(productIds.length)].map(() =>
    Math.floor(Math.random() * (30 - 1) + 1)
  );

  return [productIdList, countList];
};