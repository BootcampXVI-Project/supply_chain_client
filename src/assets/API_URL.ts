export const DOMAIN = 'https://f365932b5348.ngrok.app';

export const API_URL = {
  LOGIN: () => `${DOMAIN}/auth/login`,
};

export const API_PRODUCT = {
  GETALLPRODUCTS: () => `${DOMAIN}/product/all`,
  GETPRODUCT: (productId: string) => `${DOMAIN}/product/detail?productId=`+productId
}

