import conn from "../config/conn.js";
import {v4 as uuidv4} from 'uuid';

export const cadastrarOnibus = (req, res) => {
    const {placa, modelo, ano_fabricacao, capacidade, id_linha, id_motorista} = req.body

    //validacoes
    if(!placa){
        res.status(400).json({message: "O placa é obrigatório"})
        return
    }
    if(!modelo){
        res.status(400).json({message: "A modelo é obrigatória"})
        return
    }
    if(!ano_fabricacao){
        res.status(400).json({message: "A ano_fabricacao é obrigatória"})
        return
    }
    if(!capacidade){
        res.status(400).json({message: "A capacidade é obrigatória"})
        return
    }
    if(!id_linha){
        res.status(400).json({message: "A id_linha é obrigatória"})
        return
    }
    if(!id_motorista){
        res.status(400).json({message: "A id_motorista é obrigatória"})
        return
    }

    const checkSql = /*sql*/ `
        SELECT * FROM onibus
        WHERE ?? = ? AND ?? = ? AND ?? = ? AND ?? = ? AND ?? = ? AND ?? = ?;
    `
    const checkData = ["placa", placa, "modelo", modelo, "ano_fabricacao", ano_fabricacao, "capacidade", capacidade, "id_linha", id_linha, "id_motorista", id_motorista]

    conn.query(checkSql, checkData, (err, data)=> {
        if(err){
            res.status(500).json({message: "Erro ao buscar os onibus"})
            return console.log(err);
        }

        if(data.length > 0){
            res.status(409).json({message: "onibus já existe no banco de dados"})
            return console.log(err);
        }
    })

    const id_onibus = uuidv4()
    const insertSql = /*sql*/ `
    INSERT INTO onibus
    (??, ??, ??, ??, ??, ??, ??)
    VALUES
    (?, ?, ?, ?, ? , ?, ?)
    `

    const insertData = ["id_onibus", "placa", "modelo", "ano_fabricacao", "capacidade", "id_linha", "id_motorista", id_onibus, placa, modelo, ano_fabricacao, capacidade, id_linha, id_motorista]

    conn.query(insertSql, insertData, (err, data)=> {
        if(err){
            res.status(500).json({message: "Erro ao cadastrar onibus"})
            return console.log(err)
        }

        res.status(201).json({message: "onibus cadastrado"})
    })
}
export const buscarOnibus = (req, res) => {
    const {id_onibus} = req.params

    const checkSql = /*sql*/ `
        SELECT * FROM onibus
        WHERE ?? = ?
    `
    const checkData = ["id_onibus", id_onibus]

    conn.query(checkSql, checkData, (err, data)=> {
        if(err){
            res.status(500).json({message: "Erro ao buscar onibus"})
            return
        }

        if(data.length === 0){
            res.status(404).json({message: "onibus não encontrado"})
            return
        }

        res.status(200).json(data)
    })
}
export const getOnibus = (req, res) => {
    const checkSql = /*sql*/ ` SELECT * FROM onibus;`

    conn.query(checkSql, (err, data)=> {
        if(err){
            res.status(500).json({message: "[onibus] Erro ao buscar dados"})
            return console.log(err)
        }

        if(data.length == 0){
            res.status(404).json({message: "Nenhum onibus encontrado"})
        }

        res.status(200).json({message: '[GET] /onibus', data})
    })
}

