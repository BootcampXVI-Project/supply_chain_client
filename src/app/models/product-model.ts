import {Unit} from "../../assets/ENUM";

export interface Product {
  userId: string;
  productObj: ProductObj;
}

export interface ProductObj {
  productId: string;
  productName: string;
  dates: Dates;
  actors: Actors;
  expireTime: string;
  price: string;
  amount: string;
  unit: Unit;
  status: string;
  description: string;
  certificateUrl: string;
  supplierId: string;
  qrCode: string;
  image?: string[];
}

export interface Dates {
  cultivated: string;
  harvested: string;
  imported: string;
  manufacturered: string;
  exported: string;
  distributed: string;
  selling: string;
  sold: string;
}

export interface Actors {
  supplierId: string;
  manufacturerId: string;
  distributorId: string;
  retailerId: string;
}
