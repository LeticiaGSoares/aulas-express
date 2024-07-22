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


//***************rotas de livros***************/
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

    const checkSql = /*sql*/ `
    SELECT * FROM livros 
    WHERE id="${id}"`

    conn.query(checkSql, (err, data) => {
        if(err){
            res.status(500).json({message: "Erro ao buscar livro"})
            return
        }

        if(data.length === 0){
            res.status(404).json({message: "Livro não encontrado"})
        }

        res.status(200).json(data)
    })
})
app.put('/livros/:id', (req, res)=> {
    const {id} = req.params
    const {titulo, autor, ano_publicacao, genero, preco, disponibilidade} = req.body
    
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

    if(disponibilidade == undefined){
        res.status(400).json({message: "A disponibilidade é obrigatório"})
        return
    }

    const checkSql = /*sql*/ `
    SELECT * FROM livros 
    WHERE id="${id}"`

    conn.query(checkSql, (err, data) => {
        if(err){
            res.status(500).json({message: "Erro ao buscar livro"})
            return
        }

        if(data.length === 0){
            res.status(404).json({message: "Livro não encontrado"})
        }

        //Consulta SQL para atualizar livro
        const updateSql = /*sql*/ `UPDATE livros SET
        titulo = "${titulo}", autor = "${autor}", ano_publicacao = "${ano_publicacao}",
        genero = "${genero}", preco = "${preco}", disponibilidade = "${disponibilidade}"
        WHERE id = "${id}"
        `

        conn.query(updateSql, (err)=> {
            if(err){
                res.status(500).json({message: "Erro ao atualizar livro"})
                return
            }
            
            res.status(200).json(data)
        })                                                                                                                                                                                                                                                                
        
    })
})
app.delete('/livros/:id', (req, res)=> {
    const {id} = req.params

    const deleteSql = /*sql*/ `DELETE FROM livros WHERE id="${id}"`

    conn.query(deleteSql, (err, info)=> {
        if(err){
            res.status(500).json({message: 'Erro ao deletar livro'})
            return
        }

        if(info.affectedRows === 0){
            res.status(404).json({message: "Livro não encontrado"})
            return
        }

        res.status(200).json({message: "Livro deletado"})
    })
})

/********* rota dos funcionarios *********/
/* id, nome, cargo, data_contratacao, salario, email, created_at, updated_at*/
//Rota 01 -> lista todos
//Rota 02 -> cadastra funcionário (email único)
//Rota 03 -> lista 1 funcionário
//Rota 04 -> atualiza 1 funcionário
//Rota 05 -> deleta 1 funcionário

app.get('/funcionarios', (req, res) => {
    const checkSql = /*sql*/ `SELECT * FROM funcionarios`

    conn.query(checkSql, (err, data)=>{
        if(err){
            res.status(500).json({message: "Erro ao buscar funcionarios"})
            return console.log(err)
        }

        if(data.length == 0){
            res.status(404).json({message: "Nenhum funcionário encontrado"})
        }

        res.status(200).json({message: "[GET] /funcionarios ", data})

    })
})
app.post('/funcionarios', (req, res) => {
    const {nome, cargo, data_contratacao, salario, email} = req.body

    //validacoes
    if(!nome){
        res.status(400).json({message: "O nome é obrigatório"})
        return
    }
    if(!cargo){
        res.status(400).json({message: "O cargo é obrigatório"})
        return
    }
    if(!data_contratacao){
        res.status(400).json({message: "A data de contratação é obrigatória"})
        return
    }
    if(!salario){
        res.status(400).json({message: "O salário é obrigatório"})
        return
    }
    if(!email){
        res.status(400).json({message: "O email é obrigatório"})
        return
    }

    if(!email.includes("@")){
        res.status(400).json({message: "O email precisa ter '@'"})
        return
    }

    const checkSql = /*sql*/ `
        SELECT * FROM funcionarios
        WHERE email = "${email}"
    `

    conn.query(checkSql, (err, data)=> {
        if(err){
            res.status(500).json({message: "Erro ao buscar os funcionarios"})
            return console.log(err);
        }

        if(data.length > 0){
            res.status(409).json({message: "Funcionário já existe no banco de dados"})
            return console.log(err);
        }
    })

    const id = uuidv4()
    const insertSql = /*sql*/ `
    INSERT INTO funcionarios
    (id, nome, cargo, data_contratacao, salario, email)
    VALUES
    ("${id}", "${nome}", "${cargo}", "${data_contratacao}", "${salario}", "${email}")
    `

    conn.query(insertSql, (err, data)=> {
        if(err){
            res.status(500).json({message: "Erro ao cadastrar funcionário"})
            return console.log(err)
        }

        res.status(201).json({message: "Funcionário cadastrado"})
    })
})
app.get('/funcionarios/:id', (req, res) => {
    const {id} = req.params

    const checkSql = /*sql*/ `
        SELECT * FROM funcionarios
        WHERE id="${id}"
    `

    conn.query(checkSql, (err, data)=> {
        if(err){
            res.status(500).json({message: "Erro ao buscar funcionário"})
            return
        }

        if(data.length === 0){
            res.status(404).json({message: "Funcionário não encontrado"})
            return
        }

        res.status(200).json(data)
    })
})
app.put('/funcionarios/:id', (req, res) => {
    const {id} = req.params
    const {nome, cargo, data_contratacao, salario, email} = req.body

    if(!nome){
        res.status(400).json({message: "O nome é obrigatório"})
        return
    }
    if(!cargo){
        res.status(400).json({message: "O cargo é obrigatório"})
        return
    }
    if(!data_contratacao){
        res.status(400).json({message: "A data de contratação é obrigatória"})
        return
    }
    if(!salario){
        res.status(400).json({message: "O salário é obrigatório"})
        return
    }
    if(!email){
        res.status(400).json({message: "O email é obrigatório"})
        return
    }
    
    const checkSql = /*sql*/ `
    SELECT * FROM funcionarios 
    WHERE id = "${id}"
    `
    
    conn.query(checkSql, (err, data) => {
        if(err){
            res.status(500).json({message: "Erro ao buscar funcionário"})
            return
        }

        if(data.length === 0){
            res.status(404).json({message: "Funcionário não encontrado"})
        }
        
        const emailCheckSql = /*sql*/ `
        SELECT * FROM funcionarios 
        WHERE id = "${id}" AND email = "${email}"
        `

        conn.query(emailCheckSql, (err, data)=>{
            if(err){
                console.error(err)
                res.status(500).json({message: "Erro ao verificar o email"})
                return
            }

            if(data.length > 0){
                return res.status(409).json({message:"E-mail já está em uso!"})
            }
        })

        const updateSql = /*sql*/ `UPDATE funcionarios SET
        nome = "${nome}", cargo = "${cargo}", data_contratacao = "${data_contratacao}",
        salario = "${salario}", email = "${email}"
        WHERE id = "${id}"
        `

        conn.query(updateSql, (err)=> {
            if(err){
                res.status(500).json({message: "Erro ao atualizar funcionário"})
                return
            }

            res.status(200).json({message: "Funcionário atualizado"})
        })

    })
})
app.delete('/funcionarios/:id', (req, res) => {
    const {id} = req.params

    const deleteSql = /*sql*/ `
    DELETE FROM funcionarios WHERE id= "${id}"`

    conn.query(deleteSql, (err, info)=> {
        if(err){
            res.status(500).json({message: 'Erro ao deletar funcionário'})
            return
        }
        if(info.affectedRows === 0){
            res.status(404).json({message: 'Funcionário não encontrado'})
            return
        }

        res.status(200).json({message: 'Funcionário deletado'})

    })
})

//Rota 404
app.use((request, response)=>{
    response.status(404).json({message: "Rota não encontrada"})
})
process.on("SIGINT", ()=> {
    
})