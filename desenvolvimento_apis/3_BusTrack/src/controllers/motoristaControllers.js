import conn from "../config/conn.js";
import {v4 as uuidv4} from 'uuid';

export const cadastrarMotorista = (req, res) => { //ok
    const {nome, data_nascimento, numero_carteira_habilitacao} = req.body

    //validacoes
    if(!nome){
        res.status(400).json({message: "O nome é obrigatório"})
        return
    }
    if(!data_nascimento){
        res.status(400).json({message: "A data_nascimento é obrigatória"})
        return
    }
    if(!numero_carteira_habilitacao){
        res.status(400).json({message: "O numero_carteira_habilitacao é obrigatória"})
        return
    }

    const checkSql = /*sql*/ `
        SELECT * FROM motoristas
        WHERE ?? = ? AND ?? = ? AND ?? = ?
    `
    const checkData = ["nome", nome, "data_nascimento", data_nascimento, "numero_carteira_habilitacao", numero_carteira_habilitacao]

    conn.query(checkSql, checkData, (err, data)=> {
        if(err){
            res.status(500).json({message: "Erro ao buscar motoristas"})
            return console.log(err);
        }

        if(data.length > 0){
            res.status(409).json({message: "motorista já existe no banco de dados"})
            return console.log(err);
        }
    })

    const id_motorista = uuidv4()
    const insertSql = /*sql*/ `
    INSERT INTO motoristas (??, ??, ??, ??)
    VALUES (? , ? , ? , ?)
    `
    const insertData = ["id_motorista", "nome", "data_nascimento", "numero_carteira_habilitacao", id_motorista, nome, data_nascimento, numero_carteira_habilitacao]

    conn.query(insertSql, insertData, (err, data)=> {
        if(err){
            res.status(500).json({message: "Erro ao cadastrar motorista"})
            return console.log(err)
        }

        res.status(201).json({message: "Motorista cadastrado"})
    })
}
export const buscarMotorista = (req, res) => { //revisar 
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

        res.status(200).json(data.morotista)
    })
}
export const deletarMotorista = (req, res) => { //revisar DEFINITIVAMENTE
    const {id_onibus} = req.params

    const checkOnibusSql = /*sql*/`
        SELECT * FROM ??
        WHERE ?? = ?
    `

    const checkOnibusData = ["onibus", "id_onibus", id_onibus]

    const id_motorista = conn.query(checkOnibusSql, checkOnibusData, (err, data)=> {
        if(err){
            res.status(500).json({message: "Erro ao buscar onibus"})
            return
        }

        if(data.length === 0){
            res.status(404).json({message: "onibus não encontrado"})
            return
        }

        res.status(200).json(data.morotista)
        return data.id_motorista
    })

    const checkMotoristaSql = /*sql*/ `
        DELETE ?? WHERE ?? = ?
    `

    const checkMotoristaData = ["motoristas", "id_motorista", id_motorista]

    conn.query( checkMotoristaSql, checkMotoristaData, (err, info)=>{
        if(err){
            res.status(500).json({message: 'Erro ao deletar motorista'})
            return
        }
        if(info.affectedRows === 0){
            res.status(404).json({message: 'motorista não encontrado'})
            return
        }

        res.status(200).json({message: 'motorista deletado'})
    })
}
export const getMotoristas = (req, res) => { //ok
    const checkSql = /*sql*/ ` SELECT * FROM motoristas;`

    conn.query(checkSql, (err, data)=> {
        if(err){
            res.status(500).json({message: "[motoristas] Erro ao buscar dados"})
            return console.log(err)
        }

        if(data.length == 0){
            res.status(404).json({message: "Nenhum motorista encontrado"})
        }

        res.status(200).json({message: '[GET] /motoristas', data})
    })
}