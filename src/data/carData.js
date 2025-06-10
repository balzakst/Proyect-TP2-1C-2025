import { getDb } from "./connection.js";

export async function findAllCars() {
  const db = getDb();
  const cars = await db.collection("cars").find().toArray();
  return cars;
}
