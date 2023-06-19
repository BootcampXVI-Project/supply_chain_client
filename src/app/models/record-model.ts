import { ActorModel } from "./actor-model";
import { DateModel } from "./date-model";

export class RecordModel {
  actors: ActorModel = new ActorModel();
  amount: string = '';
  certificateUrl: string= '';
  dates: DateModel = new DateModel();
  description: string = '';
  expireTime: string ='';
  image: string[] = [];
  price: string = '';
  productId: string = '';
  productName: string = '';
  qrCode: string = '';
  status: string = '';
  supplierId: string = '';
  unit: string = '';
}
