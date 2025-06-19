import { findAllUsers, deleteUser, findByCredentials, registerUser, findUserById, updateUserById } from "../data/userData.js";

//TODOS LOS USUARIOS
export async function getUsersService(){
    return await findAllUsers();
}

// ELIMINO USUARIO POR ID
export async function deleteUserByIdService(id){
    return await deleteUser(id);
}


// LOGIN
export async function loginUserService({email, password}) {
    const user = await findByCredentials({email, password});
    if(!user){
        throw new Error ("Credenciales invalidas.");
    }
    const {password: _pw, ...userWithoutPassword} = user;
    return userWithoutPassword;
}

// REGISTRAR USUARIO
export async function registerUserService({ username, email, password }) {
    try {

        return await registerUser({ username, email, password });

    } catch (error) {
        if (error.message === "El email ya está registrado") {
            
            throw error;
            
        }
        throw new Error("Error al registrar el usuario");
    }
}

// OBTENER USUARIO POR ID
export async function getUserByIdService(id) {
    return await findUserById(id);
}

export async function updateUserDetailsService(id, updateFields) {
    try {
        return await updateUserById(id, updateFields);
    } catch (error) {
        throw error;
    }
}
