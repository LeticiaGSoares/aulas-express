import "dotenv/config";
import express from "express";
import {v4 as uuidv4} from 'uuid';

//conexão com banco de dados
import conn from "./config/conn.js";

//Importação dos modulos e criação  de tabelas
import "./models/livroModel.js";
import "./models/funcionarioModel.js";
import "./models/clienteModel.js"

//Importação das rotas
import livroRoutes from "./routes/livroRoutes.js"
import funcionarioRoutes from "./routes/funcionarioRoutes.js"
import clienteRoutes from "./routes/clienteRoutes.js"

const PORT = process.env.PORT;

const app = express();
app.use(express.urlencoded({extended: true})) //para imagens
app.use(express.json())


//Utilização das rotas (middleware)
//http://localhosta:3333/livros
app.use('/livros', livroRoutes)
app.use('/funcionarios', funcionarioRoutes)
app.use('/clientes', clienteRoutes)


app.get("/", (req, res) => {
  res.send("Olá, mundo!");
});
app.use((request, response)=>{
  response.status(404).json({message: "Rota não encontrada"})
})

app.listen(PORT, () => {
  console.log("http://localhost:" + PORT);
});
