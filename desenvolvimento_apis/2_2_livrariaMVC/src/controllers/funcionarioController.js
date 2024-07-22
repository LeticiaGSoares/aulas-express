import conn from "../config/conn.js";
import {v4 as uuidv4} from 'uuid';

export const getFuncionarios = (req, res) => {
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
};
export const cadastrarFuncionario = (req, res) => {
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

    const checkEmailExistsSql = /*sql*/ `
        SELECT * FROM funcionarios
        WHERE ?? = ?
    `
    const checkEmailExistsData = ["email", email]

    conn.query(checkEmailExistsSql, checkEmailExistsData, (err, data)=> {
        if(err){
            res.status(500).json({message: "Erro ao buscar os funcionarios"})
            return console.log(err);
        }

        if(data.length > 0){
            res.status(409).json({message: "Funcionário já existe no banco de dados"})
            return console.log(err);
        }
    })

    const func_id = uuidv4()
    const insertSql = /*sql*/ `
    INSERT INTO funcionarios
    (??, ??, ??, ??, ??, ??)
    VALUES
    (?, ?, ?, ?, ?, ?)
    `
    const insertSqlData = [
        "func_id", "nome", "cargo", "data_contratacao", "salario", "email",
        func_id, nome, cargo, data_contratacao, salario, email
    ]

    conn.query(insertSql, insertSqlData, (err, data)=> {
        if(err){
            res.status(500).json({message: "Erro ao cadastrar funcionário"})
            return console.log(err)
        }

        res.status(201).json({message: "Funcionário cadastrado"})
    })
};
export const buscarFuncionario = (req, res) =>{
    const {func_id} = req.params

    const checkSql = /*sql*/ `
        SELECT * FROM funcionarios
        WHERE ?? = ?
    `
    const checkData = ["func_id", func_id] 

    conn.query(checkSql, checkData, (err, data)=> {
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
};
export const editarFuncionario = (req, res) => {
    const {func_id} = req.params
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
    WHERE ?? = ?
    `
    const checkData = ["func_id", func_id]
    
    conn.query(checkSql, checkData, (err, data) => {
        if(err){
            res.status(500).json({message: "Erro ao buscar funcionário"})
            return
        }
        if(data.length === 0){
            res.status(404).json({message: "Funcionário não encontrado"})
        }
        
        const emailCheckSql = /*sql*/ `
        SELECT * FROM funcionarios 
        WHERE ?? = ? AND ?? = ?
        `
        const emailCheckData = [
            "func_id", func_id, "email", email
        ]

        conn.query(emailCheckSql, emailCheckData, (err, data)=>{
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
        ?? = ?, ?? = ?, ?? = ?,
        ?? = ?, ?? = ?
        WHERE ?? = ?
        `
        const updateData = [
            "nome", nome, "cargo", cargo, "data_contratacao", data_contratacao,
            "salario", salario, "email", email, "func_id", func_id
        ]

        conn.query(updateSql, updateData, (err)=> {
            if(err){
                res.status(500).json({message: "Erro ao atualizar funcionário"})
                return
            }

            res.status(200).json({message: "Funcionário atualizado"})
        })

    })
};
export const deletarFuncionario = (req, res) => {
    const {func_id} = req.params

    const deleteSql = /*sql*/ `
    DELETE FROM funcionarios WHERE ?? = ?`
    const deleteData = ["func_id", func_id]

    conn.query(deleteSql, deleteData, (err, info)=> {
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
};