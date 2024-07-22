//Nome, email, id, senha, image
//getUsuarios, cadastrarUsuario, buscarUsuario, editarUsuario, deletarUsuario
import conn from "../config/conn.js";
import {v4 as uuidv4} from 'uuid';

export const getClientes = (req, res) => {
    const checkSql = /*sql*/ `SELECT * FROM clientes`

    conn.query(checkSql, (err, data)=>{
        if(err){
            res.status(500).json({message: "Erro ao buscar clientes"})
            return console.log(err)
        }

        if(data.length == 0){
            res.status(404).json({message: "Nenhum cliente encontrado"})
        }

        res.status(200).json({message: "[GET] /clientes ", data})

    })
}
export const cadastrarCliente = (req, res) => {
    const {nome, senha, image, email} = req.body

    //validacoes
    if(!nome){
        res.status(400).json({message: "O nome é obrigatório"})
        return
    }
    if(!senha){
        res.status(400).json({message: "A senha é obrigatória"})
        return
    }
    if(!image){
        res.status(400).json({message: "A image é obrigatória"})
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
        SELECT * FROM clientes
        WHERE email = "${email}"
    `

    conn.query(checkSql, (err, data)=> {
        if(err){
            res.status(500).json({message: "Erro ao buscar os clientes"})
            return console.log(err);
        }

        if(data.length > 0){
            res.status(409).json({message: "Cliente já existe no banco de dados"})
            return console.log(err);
        }
    })

    const id = uuidv4()
    const insertSql = /*sql*/ `
    INSERT INTO clientes
    (id, nome, senha, image, email)
    VALUES
    ("${id}", "${nome}", "${senha}", "${image}", "${email}")
    `

    conn.query(insertSql, (err, data)=> {
        if(err){
            res.status(500).json({message: "Erro ao cadastrar cliente"})
            return console.log(err)
        }

        res.status(201).json({message: "Cliente cadastrado"})
    })
}
export const buscarCliente = (req, res) => {
    const {id} = req.params

    const checkSql = /*sql*/ `
        SELECT * FROM clientes
        WHERE id="${id}"
    `

    conn.query(checkSql, (err, data)=> {
        if(err){
            res.status(500).json({message: "Erro ao buscar cliente"})
            return
        }

        if(data.length === 0){
            res.status(404).json({message: "Cliente não encontrado"})
            return
        }

        res.status(200).json(data)
    })
}
export const editarCliente = (req, res) => {
    const {id} = req.params
    const {nome, senha, image, email} = req.body

    if(!nome){
        res.status(400).json({message: "O nome é obrigatório"})
        return
    }
    if(!senha){
        res.status(400).json({message: "O senha é obrigatório"})
        return
    }
    if(!image){
        res.status(400).json({message: "A data de contratação é obrigatória"})
        return
    }
    if(!email){
        res.status(400).json({message: "O email é obrigatório"})
        return
    }
    
    const checkSql = /*sql*/ `
    SELECT * FROM clientes 
    WHERE id = "${id}"
    `
    
    conn.query(checkSql, (err, data) => {
        if(err){
            res.status(500).json({message: "Erro ao buscar cliente"})
            return
        }

        if(data.length === 0){
            res.status(404).json({message: "cliente não encontrado"})
        }
        
        const emailCheckSql = /*sql*/ `
        SELECT * FROM clientes 
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

        const updateSql = /*sql*/ `UPDATE clientes SET
        nome = "${nome}", senha = "${senha}", image = "${image}", email = "${email}"
        WHERE id = "${id}"
        `

        conn.query(updateSql, (err)=> {
            if(err){
                res.status(500).json({message: "Erro ao atualizar cliente"})
                return
            }

            res.status(200).json({message: "cliente atualizado"})
        })

    })
}
export const deletarCliente = (req, res) => {
    const {id} = req.params

    const deleteSql = /*sql*/ `
    DELETE FROM clientes WHERE id= "${id}"`

    conn.query(deleteSql, (err, info)=> {
        if(err){
            res.status(500).json({message: 'Erro ao deletar cliente'})
            return
        }
        if(info.affectedRows === 0){
            res.status(404).json({message: 'cliente não encontrado'})
            return
        }

        res.status(200).json({message: 'cliente deletado'})
    })
}