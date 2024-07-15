//drive nativo 
//query builds
//ORM(sequelize ou prima)
//-------------------------------------------------
//npm init -y
//npm i express mysql2 uuid dotenv
//npm i -D nodemon

import "dotenv/config" 
import express, { response } from "express"
import mysql from "mysql2"
import {v4 as uuidv4} from 'uuid'

const PORT = process.env.PORT

const app = express()
app.use(express.json())

//Criar conexão com o banco de dados MYSQL
const conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Sen@iDev77!.',
    database: 'livraria',
    port: 3306
})

conn.connect((err)=> {
    if(err){
        return console.error(err.stack)
    }
    console.log("Mysql conectado")

    
app.listen(PORT, ()=> {
    console.log('Server running on http://localhost:' + PORT)
})
})

app.get("/livros", (req, res)=> {
    //query para banco (consulta)
    const sql = /*sql*/ 'SELECT * FROM livros'

    //params: variável p consulta, callback com err e data 
    conn.query(sql, (err, data)=>{
        if(err){
            res.status(500).json({message: "Erro ao buscar os livros"})
            return console.log(err)
        }

        const livros = data
        console.log(data)
        console.log(typeof data)
        res.status(200).json({message: "[GET] /livros >", livros})

    })
})

app.post("/livros", (req, res)=> {
    const {titulo, autor, ano_publicacao, genero, preco} = req.body

    //validações
    if(!titulo){
        res.status(400).json({message: "O título é obrigatório"})
        return
    }
    if(!autor){
        res.status(400).json({message: "O autor é obrigatório"})
        return
    }
    if(!ano_publicacao){
        res.status(400).json({message: "O ano de publicação é obrigatório"})
        return
    }
    if(!genero){
        res.status(400).json({message: "O gênero é obrigatório"})
        return
    }
    if(!preco){
        res.status(400).json({message: "O preço é obrigatório"})
        return
    }

    //cadastrar um livro -> precisa saber se esse livro existe antes
    const checkSql = /*sql*/ `
    SELECT * FROM livros 
    WHERE titulo = "${titulo}" AND 
    autor = "${autor}" AND 
    ano_publicacao= "${ano_publicacao}"
    `;

    conn.query(checkSql, (err, data)=> {
        if(err){
            res.status(500).json({message: "Erro ao buscar os livros"})
            return console.log(err);
        }

        if(data.length > 0){
            res.status(409).json({message: "Livro já existe na livraria"})
            return console.log(err);
        }
    })

    const id = uuidv4()
    const disponibilidade = 1
    const insertSql = /*sql*/ `
    INSERT INTO livros 
    (id, titulo, autor, ano_publicacao, genero, preco, disponibilidade)
    VALUES
    ("${id}","${titulo}","${autor}","${ano_publicacao}","${genero}","${preco}","${disponibilidade}")
    `

    conn.query(insertSql, (err, data)=> {
        if(err){
            res.status(500).json({message: "Erro ao cadastrar os livros"})
            return console.log(err);
        }

        res.status(201).json({message: "Livro cadastrado"})

    })
})

app.get('/livros/:id', (req, res)=> {
    const {id} = req.params
})

app.put('/livros/:id', (req, res)=> {
    const {id} = req.params
})

app.delete('/livros/:id', (req, res)=> {
    const {id} = req.params
})

//Rota 404
app.use((request, response)=>{
    response.status(404).json({message: "Rota não encontrada"})
})