export class ChartDateStatus {
  status: string = '';
  time: string =  '';
}

export class ChartProduct {
  productId: string = '';
  dates: ChartDateStatus[] = [];
}
