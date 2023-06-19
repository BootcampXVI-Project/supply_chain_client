import { ActorModel } from "./actor-model";

export class DateModel {
  status: string ='';
  time: Date = new Date();
  actor: ActorModel = new ActorModel();
}
