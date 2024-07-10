//instalar express: 'npm install express --save' e 'npm i -D nodemon'
const express = require('express')
// import express from "express"

const PORT = 3333
const app = express()

//middleware
//Aceitar JSON no body
app.use(express.json())

//.get(rota, callback)
/*Request HTTP
* query params - ....:3333/pessoas?nome="Carlos"&idade=32
* -- Rotas do tipo GET (filtros e buscas)

* route params - ....:3333/pessoas/5
* -- Rotas do tipo GET, PUT, PATCH, DELETE (listar um elemento)

* body params - ....:3333/pessoas
* -- Rotas do tipo POST (Cadastro de informações)
*/

//query params
app.get("/users", (request, response)=>{
    // const query = request.query
    // console.log(query)  
    const {nome, idade} = request.query
    console.log(nome, idade)
    response.status(200).json([
        "Pessoa 1",
        "Pessoa 2",
        "Pessoa 3"
    ])
});

app.post("/users", (request, response)=>{
    // const body = request.body
    // console.log(body)
    const {nome, idade} = request.body
    response.status(201).json([
        "Pessoa 1",
        "Pessoa 2",
        "Pessoa 3",
        "Pessoa 4"
    ])
});

app.put("/users/:id/:cpf", (request, response)=>{
    const params = request.params
    console.log(params)
    const id = request.params.id
    console.log(id)
    const cpf = request.params.cpf
    console.log(cpf)
    response.status(200).json([
        "Pessoa 1",
        "Pessoa 10",
        "Pessoa 3",
        "Pessoa 4"
    ])
});

app.delete("/users", (request, response)=>(
    response.status(204).json([
        "Pessoa 1",
        "Pessoa 3",
        "Pessoa 4"
    ])
));

//o mesmo que server.listen()
app.listen(PORT, ()=> {
    console.log("Servidor on http://localhost:" + PORT)
})