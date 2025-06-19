import { getDb } from "./connection.js";
import { ObjectId } from "mongodb";
import bcrypt from "bcrypt";

//TODOS LOS USUARIOS
export async function findAllUsers() {
    const db = getDb();
    const users = await db.collection("users").find().toArray();
    return users;
}

// ELIMINAR USUARIO
export async function deleteUser(id) {
    const db = getDb();
    const user = await db.collection("users").deleteOne({ _id: new ObjectId(id) });
    console.log(user);
    return user;
}

// LOGIN
export async function findByCredentials({ email, password }) {
    const db = getDb();
    const user = await db.collection("users").findOne({ email });
    if (!user) {
        return null;
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return null;
    }

    return user;
}
