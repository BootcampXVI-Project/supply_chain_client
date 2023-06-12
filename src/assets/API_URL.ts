export const DOMAIN = 'https://0ddeed6f66b9.ngrok.app';

export const API_URL = {
  LOGIN: () => `${DOMAIN}/auth/login`,
};

export const API_PRODUCT = {
  GETALLPRODUCTS: () => `${DOMAIN}/product/all`,
  GETPAGINATIONPRODUCTS: (pageNumber: string) => `${DOMAIN}/product/pagination?page=`+pageNumber,
  GETPRODUCT: (productId: string) => `${DOMAIN}/product/detail?productId=`+productId,

  //-----------------------------------supplier--------------------------------------//
  UPDATEPRODUCT: (userId:string) => `${DOMAIN}/product/update?userId=`+userId,
  CREATEPRODUCT: () => `${DOMAIN}/product/cultivate`,
  HARVESTPRODUCT: () => `${DOMAIN}/product/harvest`,

  //------------------------------------manufacturer----------------------------------//
  IMPORTPRODUCT: () => `${DOMAIN}/product/import`,
  MANUFACTUREPRODUCT: () => `${DOMAIN}/product/manufacture`,
  EXPORTPRODUCT: () => `${DOMAIN}/product/export`,

}

export const API_ORDER = {
  GETALLORDERS: () => `${DOMAIN}/order/all?status=PENDING`,
  GETALLORDERSMANUFACTURER: () => `${DOMAIN}/order/all/of-manufacturer`,
}



export const API_USER = {
  GETALLUSERS: () => `${DOMAIN}/user/all`,
  GETUSER: (userId:string) => `${DOMAIN}/user/`+userId,
  ADDUSER: () => `${DOMAIN}/user/`
}

