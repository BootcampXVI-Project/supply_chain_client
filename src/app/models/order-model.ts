import {Unit} from "../../assets/ENUM";
import {Actor, ProductItem} from "./product-model";

export interface Order {
  orderId: string;
  productItemList: ProductItem[];
  deliveryStatuses: DeliveryStatus[];
  signatures: string[];
  status: string;
  createDate: string;
  updateDate: string;
  finishDate: string;
  qrCode: string;
  retailer: Actor;
  manufacturer: Actor;
  distributor: Actor;
}

export interface DeliveryStatus {
  status: string,
  deliveryDate: string,
  address: string,
  actor: Actor,
}
