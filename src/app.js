import express from "express";
import morgan from "morgan";
import cors from "cors";
import carRoutes from "./routes/carRoutes.js";
import userRoutes from "./routes/userRoutes.js";


const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Rutas
app.use("/api/cars", carRoutes);
app.use("/api/users", userRoutes);

// Ruta base
app.get("/", (req, res) => {
    res.send("API Concesionaria funcionando correctamente");
});

export default app;
