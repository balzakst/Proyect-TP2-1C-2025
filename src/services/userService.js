import { findAllUsers, deleteUser, findByCredentials } from "../data/userData.js";

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
