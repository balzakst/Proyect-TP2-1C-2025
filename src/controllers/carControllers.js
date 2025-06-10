import { getAllCarsService } from "../services/carServices.js";

export const getAllCars = async (req, res) => {
    try {
        const cars = await getAllCarsService();
        res.json(cars);
    } catch (error) {
        console.error("Error al obtener autos:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};
