export const DOMAIN = 'https://878b9e33e010.ngrok.app';

export const API_URL = {
  LOGIN: () => `${DOMAIN}/auth/login`,
};

export const API_PRODUCT = {
  GETALLPRODUCTS: () => `${DOMAIN}/product/all`,
  GETPAGINATIONPRODUCTS: (pageNumber: string) => `${DOMAIN}/product/pagination?page=`+pageNumber,
  GETPRODUCT: (productId: string) => `${DOMAIN}/product/detail?productId=`+productId,
  UPDATEPRODUCT: (userId:string) => `${DOMAIN}/product/update?userId=`+userId,
  CREATEPRODUCT: () => `${DOMAIN}/product/cultivate`,
  HARVESTPRODUCT: () => `${DOMAIN}/product/harvest`,
}

export const API_USER = {
  GETALLUSERS: () => `${DOMAIN}/user/all`,
  GETUSER: (userId:string) => `${DOMAIN}/user/`+userId,
  ADDUSER: () => `${DOMAIN}/user/`
}

