import { getUsersService, deleteUserByIdService, loginUserService, registerUserService, getUserByIdService, updateUserDetailsService, changeUserRoleService } from "../services/userService.js";
import { addCarToFavoritos, removeCarFromFavoritos, getFavoritos } from "../data/userData.js";
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
        return res.json({message: "Login exitoso: ", user, token});
    }catch(error){
        if(error.message === "Credenciales invalidas."){
            return res.status(401).json({message: error.message})
        }
        console.error("Error en login: ", error);
        return res.status(500).json({message: "Error interno en login"})
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
    const { _id: userId, rol } = req.user; // Información del usuario

    if (!ObjectId.isValid(id)) {
        return res.status(400).json({ message: "ID inválido" });
    }

    // Verificar permisos
    if (rol !== "admin" && userId !== id) {
        return res.status(403).json({ message: "No autorizado. Solo puedes ver tu propio perfil." });
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
    const { _id: userId, rol } = req.user; 

    if (!ObjectId.isValid(id)) {
        return res.status(400).json({ message: "ID inválido" });
    }

    if (!email && !username) {
        return res.status(400).json({ message: "Debes enviar al menos un campo para actualizar (email o username)" });
    }

    // Verificar permisos
    if (rol !== "admin" && userId !== id) {
        return res.status(403).json({ message: "No autorizado. Solo puedes editar tu propio perfil." });
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

// Agregar auto a favoritos
export const addCarToFavoritosController = async (req, res) => {
    const { id, carId } = req.params;
    const { _id: userId, rol } = req.user;

    if (!ObjectId.isValid(id) || !ObjectId.isValid(carId)) {
        return res.status(400).json({ message: "ID de usuario o auto inválido" });
    }

    // Solo el usuario dueño o admin puede modificar sus favoritos
    if (rol !== "admin" && userId !== id) {
        return res.status(403).json({ message: "No autorizado para modificar favoritos de otro usuario" });
    }

    try {
        // Validar si ya está en favoritos
        const db = (await import("../data/connection.js")).getDb();
        const user = await db.collection("users").findOne({ _id: new ObjectId(id) });
        if (user.favoritos && user.favoritos.some(fav => fav.toString() === carId)) {
            return res.status(409).json({ message: "El auto ya está en favoritos" });
        }

        await addCarToFavoritos(id, carId);
        res.json({ message: "Auto agregado a favoritos" });
    } catch (error) {
        console.error("Error agregando favorito:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

// Quitar auto de favoritos
export const removeCarFromFavoritosController = async (req, res) => {
    const { id, carId } = req.params;
    const { _id: userId, rol } = req.user;

    if (!ObjectId.isValid(id) || !ObjectId.isValid(carId)) {
        return res.status(400).json({ message: "ID de usuario o auto inválido" });
    }

    if (rol !== "admin" && userId !== id) {
        return res.status(403).json({ message: "No autorizado para modificar favoritos de otro usuario" });
    }

    try {
        await removeCarFromFavoritos(id, carId);
        res.json({ message: "Auto eliminado de favoritos" });
    } catch (error) {
        console.error("Error eliminando favorito:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

// Obtener autos favoritos
export const getFavoritosController = async (req, res) => {
    const { id } = req.params;
    const { _id: userId, rol } = req.user;

    if (!ObjectId.isValid(id)) {
        return res.status(400).json({ message: "ID de usuario inválido" });
    }

    if (rol !== "admin" && userId !== id) {
        return res.status(403).json({ message: "No autorizado para ver favoritos de otro usuario" });
    }

    try {
        const favoritos = await getFavoritos(id);
        res.json(favoritos);
    } catch (error) {
        console.error("Error obteniendo favoritos:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

// Cambiar rol de usuario
export const changeUserRoleController = async (req, res) => {
    const { id } = req.params;
    const { newRole } = req.body;
    const { _id: adminId, rol: adminRole } = req.user;

    // Validaciones
    if (!ObjectId.isValid(id)) {
        return res.status(400).json({ message: "ID de usuario inválido" });
    }

    if (!newRole) {
        return res.status(400).json({ message: "El nuevo rol es requerido" });
    }

    // Prevenir que un admin se quite sus propios privilegios
    if (adminId === id) {
        return res.status(403).json({ message: "No puedes cambiar tu propio rol" });
    }

    try {
        const result = await changeUserRoleService(id, newRole);
        
        if (result.matchedCount === 0) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        res.json({ message: `Rol del usuario cambiado a ${newRole} correctamente` });
    } catch (error) {
        if (error.message.includes("Rol inválido")) {
            return res.status(400).json({ message: error.message });
        }
        console.error("Error cambiando rol:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};