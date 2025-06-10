import express from "express";
import { getAllUsers } from "../controllers/userController.js";
//import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getAllUsers); 

export default router;
