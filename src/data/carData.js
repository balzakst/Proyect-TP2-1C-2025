import { getDb } from "./connection.js";
import { ObjectId } from "mongodb";

export async function findAllCars() {
  const db = getDb();
  const cars = await db.collection("cars").find().toArray();
  return cars;
}

export const findCarById = async (id) => {
    const db = getDb();
    const car = await db.collection("cars").findOne({ _id: new ObjectId(id) });
    return car;
};

export const findCarsByMarca = async (marca) => {
    const db = getDb();
    const cars = await db.collection("cars").find().toArray();

    // Filtra en memoria por marca, ignorando mayúsculas/minúsculas
    return cars.filter(car => car.marca.toLowerCase() === marca.toLowerCase());
};

export const insertCar = async (carData) => {
    const db = getDb();
    const result = await db.collection("cars").insertOne(carData);
    return result.ops ? result.ops[0] : carData; 
};

export const deleteCar = async (id) => {
  const db = getDb();
  return await db.collection("cars").deleteOne({ _id: new ObjectId(id) });
};

export const updateCarById = async (id, updatedData) => {
    const db = getDb();
    return await db.collection("cars").updateOne(
        { _id: new ObjectId(id) },
        { $set: updatedData }
    );
};

export const buyCar = async (id) => {
    const db = getDb();
    return await db.collection("cars").updateOne(
        { _id: new ObjectId(id), disponible: true },
        { $set: { disponible: false } }
    );
};