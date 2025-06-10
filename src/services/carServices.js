import { findAllCars } from "../data/carData.js";

export const getAllCarsService = async () => {
  return await findAllCars();
};
