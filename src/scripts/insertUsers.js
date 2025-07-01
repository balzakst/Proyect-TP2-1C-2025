import bcrypt from "bcrypt";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";
dotenv.config();

const uri = process.env.MONGO_URI; 
const client = new MongoClient(uri);

const users = [
  { username: "admin1", email: "admin1@gmail.com", password: "admin123", rol: "admin", favoritos: [] },
  { username: "admin2", email: "admin2@gmail.com", password: "admin456", rol: "admin", favoritos: [] },
  { username: "Fabrizio", email: "fabrizio@gmail.com", password: "Fabrizio1", rol: "comun", favoritos: [] },
  { username: "Lucia", email: "lucia@gmail.com", password: "Lucia1", rol: "comun", favoritos: [] },
  { username: "JuanTomas", email: "juantomas@gmail.com", password: "Juantomas1", rol: "comun", favoritos: [] },
  { username: "JuanManuel", email: "juanmanuel@gmail.com", password: "Juanmanuel1", rol: "comun", favoritos: [] },
  { username: "Nicolas", email: "nicolas@gmail.com", password: "Nicolas1", rol: "comun", favoritos: [] },
  { username: "Camila", email: "camila@gmail.com", password: "Camila1", rol: "comun", favoritos: [] },
  { username: "Pablo", email: "pablo@gmail.com", password: "Pablo1", rol: "comun", favoritos: [] },
  { username: "Romina", email: "romina@gmail.com", password: "Romina1", rol: "comun", favoritos: [] },
  { username: "Francisco", email: "francisco@gmail.com", password: "Francisco1", rol: "comun", favoritos: [] },
  { username: "Martin", email: "martin@gmail.com", password: "Martin1", rol: "comun", favoritos: [] },
  { username: "Marcela", email: "marcela@gmail.com", password: "Marcela1", rol: "comun", favoritos: [] },
  { username: "Juan", email: "juan@gmail.com", password: "Juan1", rol: "comun", favoritos: [] },
  { username: "Ramiro", email: "ramiro@gmail.com", password: "Ramiro1", rol: "comun", favoritos: [] },
  { username: "Facundo", email: "facundo@gmail.com", password: "Facundo1", rol: "comun", favoritos: [] },
  { username: "Manuel", email: "manuel@gmail.com", password: "Manuel1", rol: "comun", favoritos: [] },
  { username: "Juana", email: "juana@gmail.com", password: "Juana1", rol: "comun", favoritos: [] },
  { username: "Micaela", email: "micaela@gmail.com", password: "Micaela", rol: "comun", favoritos: [] },
  { username: "Maria", email: "maria@gmail.com", password: "Maria1", rol: "comun", favoritos: [] }
];

async function insertUsers() {
  try {
    await client.connect();
    const db = client.db("concesionaria"); 
    const hashedUsers = await Promise.all(
      users.map(async user => ({
        ...user,
        password: await bcrypt.hash(user.password, 10)
      }))
    );

    await db.collection("users").deleteMany(); // limpia la colección anterior
    const result = await db.collection("users").insertMany(hashedUsers);
    console.log(`Usuarios insertados: ${result.insertedCount}`);
  } catch (error) {
    console.error("Error insertando usuarios:", error);
  } finally {
    await client.close();
  }
}

insertUsers();
