import express from "express";
import { getAllCars , getOneCar , getCarsByMarca, addOneCar , deleteCar , updateOneCar, buyCar} from "../controllers/carControllers.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getAllCars);
router.get("/marca/:marca", getCarsByMarca);
router.get("/:id", getOneCar);
router.post("/add", authMiddleware, addOneCar);
router.post("/:id/buy", authMiddleware, buyCar);
router.delete("/:id", authMiddleware, deleteCar);
router.put("/:id", authMiddleware, updateOneCar);

export default router;

