import "dotenv/config"
import express from "express"

//Importar conexão
import conn from './config/conn.js'

const PORT = process.env.PORT

const app = express()

app.get("/", (req, res)=> {
    res.send("Olá, mundo!")
})

app.listen(PORT, ()=> {
    console.log("Servidor on http://localhost:" + PORT)
})