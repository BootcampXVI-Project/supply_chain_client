import { DateModel } from "./date-model";

export class ProductCommercialModel {
  productCommercialId: string = '';
  productId: string = '';
  productName: string = '';
  image: string[] = [];
  dates: DateModel[] = [];
  expireTime: string = '';
  price: string = '';
  unit: string = '';
  status: string = '';
  description: string = '';
  certificateUrl: string = '';
  qrCode: string = '';
  __v: number = 0;
}
