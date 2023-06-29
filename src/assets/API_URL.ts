export const DOMAIN = 'https://a429c9e9a688.ngrok.app';

export const API_URL = {
  LOGIN: () => `${DOMAIN}/auth/login`,
};

export const API_PRODUCT = {
  GETALLPRODUCTS: () => `${DOMAIN}/product/all`,
  GETALLPRODUCTSOFSUPPLIER: () => `${DOMAIN}/supplier/products`,
  GETPAGINATIONPRODUCTS: (pageNumber: string) => `${DOMAIN}/product/pagination?page=`+pageNumber,
  GETPRODUCT: (productId: string) => `${DOMAIN}/product/`+productId,

  //-----------------------------------supplier--------------------------------------//
  UPDATEPRODUCT: (userId:string) => `${DOMAIN}/product/update?userId=`+userId,
  CREATEPRODUCT: () => `${DOMAIN}/product/cultivate`,
  HARVESTPRODUCT: () => `${DOMAIN}/product/harvest`,

  //------------------------------------manufacturer----------------------------------//
  IMPORTPRODUCT: () => `${DOMAIN}/product/import`,
  MANUFACTUREPRODUCT: () => `${DOMAIN}/product/manufacture`,
  EXPORTPRODUCT: () => `${DOMAIN}/product/export`,

  GET_COMMERCIAL_PRODUCT_BY_PRODUCT_ID: (productId: string) => `${DOMAIN}/product-commercial/${productId}`
}

export const API_ORDER = {
  GETALLORDERS: () => `${DOMAIN}/order/all`,
  GETALLORDERSMANUFACTURER: () => `${DOMAIN}/order/all/of-manufacturer`,
  GETORDER: (orderId: string) => `${DOMAIN}/order/`+ orderId,
  APPROVEORDER: () => `${DOMAIN}/manufacturer/order/approve`,
  REJECTORDER: () => `${DOMAIN}/manufacturer/order/reject`,
}

export const API_HISTORY = {
  GETALLHISTORIES: () => `${DOMAIN}/product/transaction-history`,
  GETHISTORYPRODUCT:(productId: string) => `${DOMAIN}/product/transaction-history/`+productId
}

export const API_USER = {
  GETALLUSERS: () => `${DOMAIN}/user/all`,
  GETUSER: (userId:string) => `${DOMAIN}/user/`+userId,
  ADDUSER: () => `${DOMAIN}/user/`
}

