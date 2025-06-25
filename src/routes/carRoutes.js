import express from "express";
import { getAllCars , getOneCar , getCarsByMarca, addOneCar , deleteCar , updateOneCar, buyCar} from "../controllers/carControllers.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { requireRole } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/", getAllCars);
router.get("/marca/:marca", getCarsByMarca);
router.get("/:id", getOneCar);
router.post("/add", authMiddleware, requireRole("admin"), addOneCar);
router.post("/:id/buy", authMiddleware, buyCar);
router.delete("/:id", authMiddleware, requireRole("admin"), deleteCar);
router.put("/:id", authMiddleware, requireRole("admin"), updateOneCar);

export default router;

