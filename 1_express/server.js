//instalar express: 'npm install express --save' e 'npm i -D nodemon'
const express = require('express')
// import express from "express"

const PORT = 3333
const app = express()

//.get(rota, callback)
app.get("/users", (request, response)=>{
    response.status(200).json([
        "Pessoa 1",
        "Pessoa 2",
        "Pessoa 3"
    ])
});

app.post("/users", (request, response)=>(
    response.status(201).json([
        "Pessoa 1",
        "Pessoa 2",
        "Pessoa 3",
        "Pessoa 4"
    ])
));

app.put("/users", (request, response)=>(
    response.status(200).json([
        "Pessoa 1",
        "Pessoa 10",
        "Pessoa 3",
        "Pessoa 4"
    ])
));

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