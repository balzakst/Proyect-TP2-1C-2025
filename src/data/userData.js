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

// REGISTRAR USUARIO
export async function registerUser({ username, email, password }) {
    const db = getDb();
    // Aca verificamos si el usuario ya existe buscándolo por el email
    const existingUser = await db.collection("users").findOne({ email });
    if (existingUser) {
        throw new Error("El email ya está registrado");
    }
    // Se hace el Hash de la contraseña
    // saltround es la cantidad de veces que se aplica el encriptado-->+Encriptado = +Tiempo de procesamiento)
    const saltRounds = 10;
    const bcrypt = await import('bcrypt');
    const hashedPassword = await bcrypt.default.hash(password, saltRounds);
    const newUser = {
        username,
        email,
        password: hashedPassword,
        rol: "user",
        favoritos: [] 
    };
    const result = await db.collection("users").insertOne(newUser);
    return result;
}

export async function findUserById(id) {
    const db = getDb();
    const user = await db.collection("users").findOne({ _id: new ObjectId(id) });
    return user;
}

export async function updateUserById(id, updateFields) {
    const db = getDb();

    // Verificamos que otro usuario no tenga ya ese mail
    if (updateFields.email) {
        const existing = await db.collection("users").findOne({ email: updateFields.email, _id: { $ne: new ObjectId(id) } });
        if (existing) {
            throw new Error("El email ya está en uso por otro usuario");
        }
    }

    const result = await db.collection("users").updateOne(
        { _id: new ObjectId(id) },
        { $set: updateFields }
    );
    return result;
}

// Agregar auto a favoritos
export async function addCarToFavoritos(userId, carId) {
    const db = getDb();
    return db.collection("users").updateOne(
        { _id: new ObjectId(userId) },
        { $addToSet: { favoritos: new ObjectId(carId) } }
    );
}

// Quitar auto de favoritos
export async function removeCarFromFavoritos(userId, carId) {
    const db = getDb();
    return db.collection("users").updateOne(
        { _id: new ObjectId(userId) },
        { $pull: { favoritos: new ObjectId(carId) } }
    );
}

// Obtener autos favoritos
export async function getFavoritos(userId) {
    const db = getDb();
    const user = await db.collection("users").findOne({ _id: new ObjectId(userId) });
    if (!user || !user.favoritos) return [];
    return db.collection("cars").find({ _id: { $in: user.favoritos } }).toArray();
}

// Cambiar rol de usuario
export async function updateUserRole(userId, newRole) {
    const db = getDb();
    
    // Validar que el rol sea válido
    const validRoles = ['admin', 'user'];
    if (!validRoles.includes(newRole)) {
        throw new Error("Rol inválido. Roles válidos: admin, user");
    }
    
    const result = await db.collection("users").updateOne(
        { _id: new ObjectId(userId) },
        { $set: { rol: newRole } }
    );
    
    return result;
}
