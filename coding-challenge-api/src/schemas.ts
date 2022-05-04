interface Store {
  storeId: number;
  marketplace: string;
  country: string;
  shopName: string;
}

interface Order {
  Id: number;
  storeId: number;
  orderId: string;
  latest_ship_date: string;
  shipment_status: string;
  destination: string;
  items: number;
  orderValue: number;
}

interface OverdueOrder {
  marketplace: string;
  country: string;
  shopName: string;
  orderId: string;
  overdueDays: number;
  destination: string;
  items: number;
  orderValue: number;
}

export { Store, Order, OverdueOrder };
