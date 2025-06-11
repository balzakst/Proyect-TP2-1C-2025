import express from "express";
import { getAllCars , getOneCar , getCarsByMarca, addOneCar , deleteCar , updateOneCar} from "../controllers/carControllers.js";
//import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getAllCars);
router.get("/:marca", getCarsByMarca);
router.get("/:id", getOneCar);

router.post("/add", addOneCar);

router.delete("/:id", deleteCar); 

router.put("/:id", updateOneCar);

export default router;

