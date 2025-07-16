import express from "express";
import { getAllUsersController, deleteUserController, loginUserController, registroUsuarioController, getUserByIdController, updateDetallesController, addCarToFavoritosController, removeCarFromFavoritosController, getFavoritosController, changeUserRoleController } from "../controllers/userController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { requireRole } from "../middleware/roleMiddleware.js";

const router = express.Router();

// Rutas públicas (no requieren autenticación)
router.post("/register", registroUsuarioController);
router.post("/login", loginUserController);

// Rutas que requieren autenticación
router.get("/:id", authMiddleware, getUserByIdController);
router.put("/:id", authMiddleware, updateDetallesController);
router.post("/:id/favoritos/:carId", authMiddleware, addCarToFavoritosController);
router.delete("/:id/favoritos/:carId", authMiddleware, removeCarFromFavoritosController);
router.get("/:id/favoritos", authMiddleware, getFavoritosController);

// Rutas que requieren rol de administrador
router.get("/", authMiddleware, requireRole("admin"), getAllUsersController);
router.delete("/:id", authMiddleware, requireRole("admin"), deleteUserController);
router.put("/:id/role", authMiddleware, requireRole("admin"), changeUserRoleController);

export default router;
