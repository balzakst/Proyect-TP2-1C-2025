import { getDb } from "./connection.js";

export async function findAllUsers() {
    const db = getDb();
    const users = await db.collection("users").find().toArray();
    return users;
}
