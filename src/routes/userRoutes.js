import express from "express";
import { getAllUsersController, deleteUserController, loginUserController, registroUsuarioController, getUserByIdController, updateDetallesController } from "../controllers/userController.js";
//import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getAllUsersController); 
router.get("/:id", getUserByIdController);
router.delete("/:id", deleteUserController);
router.post("/register", registroUsuarioController);
router.post("/login", loginUserController);
router.put("/:id", updateDetallesController);

export default router;
