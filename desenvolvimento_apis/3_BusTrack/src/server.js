import "dotenv/config";
import express from "express";

//Importação dos modulos e criação  de tabelas
import "./models/linhaModel.js";
import "./models/motoristaModel.js";
import "./models/onibusModel.js"

//Importação das rotas
import linhaRoutes from "./routes/linhaRoutes.js"
import motoristaRoutes from "./routes/motoristaRoutes.js"
import onibusRoutes from "./routes/onibusRoutes.js"

const PORT = process.env.PORT;

const app = express();
app.use(express.urlencoded({extended: true})) //para imagens
app.use(express.json())


//Utilização das rotas (middleware)
app.use('/linhas', linhaRoutes)
app.use('/motoristas', motoristaRoutes)
app.use('/onibus', onibusRoutes)


app.get("/", (req, res) => {
  res.send("Olá, mundo!");
});
app.use((request, response)=>{
  response.status(404).json({message: "ERRO 404: Rota não encontrada"})
})

app.listen(PORT, () => {
  console.log("http://localhost:" + PORT);
});
