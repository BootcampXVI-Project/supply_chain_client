export const DOMAIN = 'https://32a97236a7c8.ngrok.app';

export const API_URL = {
  LOGIN: () => `${DOMAIN}/auth/login`,
};

export const API_PRODUCT = {
  GETALLPRODUCTS: () => `${DOMAIN}/product/all`,
  GETPRODUCT: (productId: string) => `${DOMAIN}/product/detail?productId=`+productId,
  UPDATEPRODUCT: (userId:string) => `${DOMAIN}/product/update?userId=`+userId,
  CREATEPRODUCT: () => `${DOMAIN}/product/create`,
  HARVESTPRODUCT: () => `${DOMAIN}/product/harvest`,
}

