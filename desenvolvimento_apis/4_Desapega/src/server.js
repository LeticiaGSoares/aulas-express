import "dotenv/config";
import express, { json } from "express";
import conn from "./config/conn.js";

import usuariosRoutes from "./routes/usuariosRoutes.js"

import "./models/usuarioModel.js"

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

app.use(express.urlencoded({extended: true}))
app.use(json())
app.use(logRoutes)

app.use("/usuarios", usuariosRoutes)

app.use("*", (req, res) => {
    res.status(404).send({ message: "Rota não encontrada" })
})

app.listen(PORT, () => {
  console.log("Servidor rodando na porta: " + PORT);
});
