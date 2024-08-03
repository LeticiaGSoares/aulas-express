import "dotenv/config";
import express, { json } from "express";
import conn from "./config/conn.js";
import path from 'node:path'
import { fileURLToPath } from "node:url";

import usuariosRoutes from "./routes/usuariosRoutes.js"
import objetoRoutes from "./routes/objetosRoutes.js"

import "./models/usuarioModel.js"
import "./models/objetoModel.js"
import "./models/objetoImagesModel.js"

const PORT = process.env.PORT;
const app = express();

const logRoutes = (req, res, next) => {
    const { url, method } = req;
    const rota = `[${method.toUpperCase()}] ${url}`;
    console.log(rota);
    next();
};  

export const messageRoutes = (req, res) => {
    const { url, method } = req;
    const rota = `[${method.toUpperCase()}] ${url}`;
    return rota;
}

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(logRoutes)


//localizar onde está a pasta public
app.use("/public", express.static(path.join(__dirname) + "public"))

app.use("/usuarios", usuariosRoutes)
app.use("/objeto", objetoRoutes)

app.use("*", (req, res) => {
    res.status(404).send({ message: "Rota não encontrada" })
})

app.listen(PORT, () => {
  console.log("Servidor rodando na porta: " + PORT);
});
