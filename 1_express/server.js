//instalar express: 'npm install express --save' e 'npm i -D nodemon'
// const express = require('express')
import express from "express"
import {v4 as uuidv4} from 'uuid'

const PORT = 3333
const app = express()

/*middleware - verificação das requisições com "()=>{}" e três parametros
*/

const logRoutes = (request, response, next)=>{
    const {method, url} = request
    const rota = `[${method.toUpperCase()}] ${url}`
    console.log(rota)
    next()
}

//Aceitar JSON no body
app.use(express.json())
//Middleware para todas as rotas
app.use(logRoutes)

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
    console.log("nome: ", nome, "|| idade ", idade)
    response.status(200).json(users)
});

const users = []

app.post("/users", (request, response)=>{
    // const body = request.body
    // console.log(body)
    const {nome, idade} = request.body
    
    if(!nome){
        response.status(400).json({message: "O nome é obrigatório"})
        return
    }
    
    if(!idade){
        response.status(400).json({message: "A idade é obrigatória"})
        return
    }

    const user = {
        id: uuidv4(),
        nome,
        idade
    }

    users.push(user)
    response.status(201).json([
        {message: "Usuário cadastrado"},
        users
    ])
});

app.put("/users/:id/:cpf", (request, response)=>{
    const {id} = request.params;
    const {nome, idade} = request.body;

    const indexUser = users.findIndex((user) => user.id == id)
    if(indexUser === -1){
        response.status(404).json({message: "Usuário não encontrado"})
        return
    }

    if(!nome || !idade){
        response.status(404).json({message: "Um dos campos obrigatórios está vazio"})
        return
    }

    const updateUser = {
        id,
        nome,
        idade
    }

    users[indexUser] = foundUser

    response.status(200).json([
        "Pessoa 1",
        "Pessoa 10",
        "Pessoa 3",
        "Pessoa 4"
    ])
});

app.delete("/users/:id", (request, response)=>{
    const id = request.params.id

    const indexUser = users.findIndex((user) => user.id == id)
    if(indexUser === -1){
        response.status(404).json({message: "Usuário não encontrado"})
        return
    }

    users.splice(indexUser, 1)
    response.status(204).send("apagado")
});

//o mesmo que server.listen()
app.listen(PORT, ()=> {
    console.log("Servidor on http://localhost:" + PORT)
})