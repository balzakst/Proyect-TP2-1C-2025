import { getUsersService, deleteUserByIdService, loginUserService, registerUserService, getUserByIdService, updateUserDetailsService } from "../services/userService.js";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";

//TODOS LOS USUARIOS
export const getAllUsersController = async (req, res) => {
    try {
        const users = await getUsersService();
        res.json(users);
    } catch (error) {
        console.error("Error al obtener usuarios:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

//ELIMINAR USUARIO
export async function deleteUserController(req, res) {
    try {
        const id = req.params.id;
        const deleted = await deleteUserByIdService(id);

        if (!deleted) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        res.status(200).json({ message: "Usuario eliminado correctamente" });
    } catch (error) {
        console.error("Error al eliminar user: ", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
}

// LOGIN
export async function loginUserController(req,res){
    const {email,password} = req.body;

    if(!email || !password){
        return res.status(400).json({message: "Faltan datos"})
    }

    try{
        const user = await loginUserService({email, password})
        //Generar el JWT
        const token = jwt.sign(
            {_id: user._id, name: user.name, email: user.email, rol: user.rol}, 
            process.env.JWT_SECRET, 
            {expiresIn: "2h"}
        );
        res.json({message: "Login exitoso: ", user, token});
    }catch(error){
        if(error.message === "Credenciales invalidas."){
            res.status(401).json({message: error.message})
        }
        console.error("Error en login: ", error);
        res.status(500).json({message: "Error interno en login"})
    }
}

// REGISTRAR
export const registroUsuarioController = async (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        return res.status(400).json({ message: "Faltan campos obligatorios (username, email, password)" });
    }
    try {
        const result = await registerUserService({ username, email, password });
        res.status(201).json({ message: "Usuario registrado exitosamente", userId: result.insertedId });
    } catch (error) {
        if (error.message === "El email ya está registrado") {
            return res.status(409).json({ message: error.message });
        }
        console.log("Error registrando usuario: ", error);
        res.status(500).json({ message: "Error interno al registrar usuario" });
    }
};

// OBTENER USUARIO POR ID
export const getUserByIdController = async (req, res) => {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
        return res.status(400).json({ message: "ID inválido" });
    }

    try {
        const user = await getUserByIdService(id);
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }
        res.json(user);
    } catch (error) {
        console.error("Error al obtener usuario por ID:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

export const updateDetallesController = async (req, res) => {
    const { id } = req.params;
    const { email, username } = req.body;

    if (!ObjectId.isValid(id)) {
        return res.status(400).json({ message: "ID inválido" });
    }

    if (!email && !username) {
        return res.status(400).json({ message: "Debes enviar al menos un campo para actualizar (email o username)" });
    }

    try {
        const updateFields = {};
        if (email) updateFields.email = email;
        if (username) updateFields.username = username;

        const result = await updateUserDetailsService(id, updateFields);

        if (result.matchedCount === 0) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        res.json({ message: "Usuario actualizado correctamente" });
    } catch (error) {
        if (error.message === "El email ya está en uso por otro usuario") {
            return res.status(409).json({ message: error.message });
        }
        console.error("Error actualizando usuario:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};