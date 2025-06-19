import { getUsersService, deleteUserByIdService, loginUserService } from "../services/userService.js";
import jwt from "jsonwebtoken";

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