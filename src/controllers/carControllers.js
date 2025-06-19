import { getAllCarsService , getCarById , getCarByMarca , addCar , deleteCarById , updateCar, buyCarService } from "../services/carServices.js";
import { ObjectId } from "mongodb";

export const getAllCars = async (req, res) => {
    try {
        const cars = await getAllCarsService();
        res.json(cars);
    } catch (error) {
        console.error("Error al obtener autos:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

export const getOneCar = async (req, res) => {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
        return res.status(400).json({ message: "ID inválido" });
    }

    try {
        const car = await getCarById(id);
        if (!car) {
            return res.status(404).json({ message: "Auto no encontrado" });
        }
        res.json(car);
    } catch (error) {
        console.error("Error buscando auto por ID:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

export const getCarsByMarca = async (req, res) => {
    const { marca } = req.params;

    try {
        const cars = await getCarByMarca(marca);
        if (cars.length === 0) {
            return res.status(404).json({ message: "No se encontraron autos para esa marca" });
        }
        res.json(cars);
    } catch (error) {
        console.error("Error buscando autos por marca:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

export const addOneCar = async (req, res) => {

   const { rol } = req.user;
   if (rol !== "admin") {
       return res.status(403).json({ message: "Acceso denegado: solo administradores pueden agregar autos." });
   } 

    try {
        const newCar = await addCar(req.body);
        res.status(201).json({ message: "Auto agregado con éxito", car: newCar });
    } catch (error) {
        console.error("Error al agregar auto:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

export const deleteCar = async (req, res) => {
  const { rol } = req.user;
  const { id } = req.params;

  if (rol !== "admin") {
    return res.status(403).json({ message: "Acceso denegado: solo administradores pueden eliminar autos." });
  }

  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ message: "ID inválido" });
  }

  try {
    const result = await deleteCarById(id);

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Auto no encontrado" });
    }
    res.json({ message: "Auto eliminado correctamente" });

  } catch (error) {
    console.error("Error al eliminar auto:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const updateOneCar = async (req, res) => {
    const { id } = req.params;
    const updatedData = req.body;

    if (req.user.rol !== "admin") {
        return res.status(403).json({ message: "No autorizado. Solo administradores pueden editar autos." });
    }

    try {
        const result = await updateCar(id, updatedData);

        if (result.matchedCount === 0) {
            return res.status(404).json({ message: "Auto no encontrado" });
        }
        const updatedCar = await getCarById(id);
        res.json({ message: "Auto actualizado correctamente", updatedCar });
    } catch (error) {
        console.error("Error actualizando auto:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

export const buyCar = async (req, res) => {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
        return res.status(400).json({ message: "ID inválido" });
    }

    try {
        const result = await buyCarService(id);

        if (result.matchedCount === 0) {
            return res.status(404).json({ message: "Auto no encontrado o no disponible para comprar" });
        }

        if (result.modifiedCount === 0) {
            return res.status(400).json({ message: "El auto no está disponible para comprar" });
        }

        const purchasedCar = await getCarById(id);
        res.json({ message: "Auto comprado exitosamente", car: purchasedCar });
    } catch (error) {
        console.error("Error al comprar auto:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};