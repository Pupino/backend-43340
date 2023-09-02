export const createProductErrorInfo = (product) => {
  return `
        All fields are mandatory: title, description, code, price, stock and category. Some is missing:
        Received product fields:
          * title: Must be a string. (${product.title})
          * description: Must be a string. (${product.description})
          * code: Must be a string and unique. (${product.code})
          * price: Must be numeric. (${product.price})
          * stock: Must be numeric. (${product.stock})
          * category: Must be a string. (${product.category})
      `;
};
