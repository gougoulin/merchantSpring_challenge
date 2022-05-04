import express, { Request, Response } from "express";

import cors from "cors";
import { getUser } from "./user";
import { getStores, getOrders } from "./data";
import { Order, OverdueOrder, Store } from "./schemas";
import moment from "moment";

const app = express();
const port = 8080;

app.use(cors());
app.get("/user", getUser);

app.get("/sales", async (req, res) => {
  /** Write an api for the widget */
  const stores: Store[] = await getStores();
  const orders: Order[] = await getOrders();
  const overdueOrders = orders.map((order) => {
    if (order.shipment_status === "Pending") {
      const orderStore = stores.find(
        (store) => store.storeId === order.storeId
      );
      if (!orderStore) {
        console.log(`Can not find store ${order.storeId} of the order`);
        return null;
      }
      const now = moment();
      const shipDate = order.latest_ship_date.split("/");
      let overdueDays = moment
        .duration(
          now.diff(moment(`${shipDate[2]}-${shipDate[1]}-${shipDate[0]}`))
        )
        .asDays();
      overdueDays = Math.round(overdueDays);

      let overdueOrder: OverdueOrder = {
        marketplace: orderStore.marketplace,
        country: orderStore.country,
        shopName: orderStore.shopName,
        orderId: order.orderId,
        overdueDays,
        destination: order.destination,
        items: order.items,
        orderValue: order.orderValue,
      };
      return overdueOrder;
    }
    return null;
  });
  const data = overdueOrders.filter((item) => item);
  res.status(200).json({ overdueOrders: data });
});

app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`);
});
