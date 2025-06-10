import app from "./src/app.js";
import { connectDB } from "./src/data/connection.js";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 3000;

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    });
}).catch((error) => {
    console.error("Error conectando a la base de datos:", error);
});
