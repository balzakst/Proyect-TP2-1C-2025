import { findAllCars , findCarById, findCarsByMarca , insertCar , deleteCar , updateCarById } from "../data/carData.js";

export const getAllCarsService = async () => {
  return await findAllCars();
};

export const getCarById = async (id) => {
    const car = await findCarById(id);
    if (!car) return null;

    return {
        ...car,
        precio: `$${car.precio}`,
    };
};

export const getCarByMarca = async (marca) => {
    const cars = await findCarsByMarca(marca);

    return cars.map(car => ({
        ...car,
        precio: `$${car.precio}`
    }));
};

export const addCar = async (carData) => {
    return await insertCar(carData);
};

export const deleteCarById = async (id) => {
  return await deleteCar(id);
};

export const updateCar = async (id, updatedData) => {
    return await updateCarById(id, updatedData);
};