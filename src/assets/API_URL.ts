export const DOMAIN = 'http://localhost:4000';

export const API_URL = {
  LOGIN: () => `${DOMAIN}/auth/login`,
};

export const API_PRODUCT = {
  GETALLPRODUCTS: () => `${DOMAIN}/product/all`,
  GETPRODUCT: (productId: string) => `${DOMAIN}/product/detail?productId=`+productId
}

