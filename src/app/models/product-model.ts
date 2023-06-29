import {Unit} from "../../assets/ENUM";

export interface Product {
  userId: string;
  productObj: ProductObj;
}

export interface ProductObj {
  productId: string,
  productName: string,
  dates: Dates[],
  expireTime: string,
  price: string,
  amount: string,
  unit: Unit,
  status: string,
  description: string,
  certificateUrl: string,
  supplier: Actor,
  qrCode: string,
  image: string[],
}

export interface CompareObj {
  new: {
    record: ProductObj,
    transactionId: string,
    timestamp: string,
    isDelete: boolean
  },
  old: {
    record: ProductObj,
    transactionId: string,
    timestamp: string,
    isDelete: boolean
  }
}

export interface ProductModel {
  productObj: {
    productId: string | undefined,
    productName: string,
    image: string[],
    price: string,
    amount: string,
    unit: Unit,
    description: string,
    certificateUrl: string
  }
}

export interface Dates {
  actor: Actor;
  status: string;
  time: string;
}

export interface Actor {
  address: string,
  avatar: string,
  fullName: string,
  phoneNumber: string,
  role: string,
  userId: string,
}

export interface Actors {
  supplierId: string;
  manufacturerId: string;
  distributorId: string;
  retailerId: string;
}

export interface ProductImport {
  productId: string;
  price: string;
}

export interface ProductManufacture {
  productId: string,
  imageUrl: string[],
  expireTime: string
}

export interface ProductItem {
  product: ProductObj,
  quantity: string
}
