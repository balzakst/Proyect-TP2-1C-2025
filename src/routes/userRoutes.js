import express from "express";
import { getAllUsersController, deleteUserController, loginUserController } from "../controllers/userController.js";
//import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getAllUsersController); 
router.delete("/:id", deleteUserController);
router.post("/login", loginUserController);

export default router;
