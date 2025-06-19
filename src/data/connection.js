import { MongoClient } from "mongodb";
import dotenv from "dotenv";


dotenv.config();

let client;
let db;

export async function connectDB() {
    const uri = process.env.MONGO_URI;

    client = new MongoClient(uri);
    await client.connect();
    db = client.db("concesionaria");
    console.log("🔌 Conectado a MongoDB");
}

export function getDb() {
    if (!db) {
        throw new Error("DB no inicializada. Ejecutá connectDB primero.");
    }
    return db;
}
