import fs, { read } from "fs";
import path from "path";
import { Order, Store } from "./schemas";
import os from "os";
import { parse } from "csv-parse";
import * as csv from "fast-csv";

const readCSV = (path: string): any => {
  return new Promise((resolve) => {
    let output: any[] = [];
    if (!fs.existsSync(path)) {
      console.log(`${path} does not exist`);
      resolve(output);
    }
    let stream = fs
      .createReadStream(path)
      .pipe(csv.parse({ headers: true }))
      .on("error", (error) => console.error(error))
      .on("data", (row) => output.push(row))
      .on("end", (rowCount: number) => {
        console.log(`${path}, parsed ${rowCount} rows`);
        resolve(output);
      });
  });
};

const getStores = async (): Promise<Store[]> => {
  let output: Store[] = [];
  try {
    const filePath = path.join(__dirname, "..", "data", "stores.csv");
    output = await readCSV(filePath);
  } catch (error) {
    console.log(error);
  }
  return output;
};

const getOrders = async (): Promise<Order[]> => {
  let output: Order[] = [];
  try {
    const filePath = path.join(__dirname, "..", "data", "orders.csv");
    output = await readCSV(filePath);
  } catch (error) {
    console.log(error);
  }
  return output;
};

export { getStores, getOrders };
