import conn from "../config/conn.js";
import {v4 as uuidv4} from 'uuid';

export const cadastrarLinha = (req, res) => { //ok
    const {nome_linha, numero_linha, itinerario} = req.body

    //validacoes
    if(!nome_linha){
        res.status(400).json({message: "O nome_linha é obrigatório"})
        return
    }
    if(!numero_linha){
        res.status(400).json({message: "A numero_linha é obrigatória"})
        return
    }
    if(!itinerario){
        res.status(400).json({message: "A itinerario é obrigatória"})
        return
    }

    const checkSql = /*sql*/ `
        SELECT * FROM linhas
        WHERE ?? = ? AND ?? = ? AND ?? = ?
    `
    const checkData = ["nome_linha", nome_linha, "numero_linha", numero_linha, "itinerario", itinerario]

    conn.query(checkSql, checkData, (err, data)=> {
        if(err){
            res.status(500).json({message: "Erro ao buscar as linhas"})
            return console.log(err);
        }

        if(data.length > 0){
            res.status(409).json({message: "linha já existe no banco de dados"})
            return console.log(err);
        }
    })

    const id_linha = uuidv4()
    const insertSql = /*sql*/ `
    INSERT INTO linhas (??, ??, ??, ??)
    VALUES (? , ? , ? , ?)
    `
    const insertData = ["id_linha", "nome_linha", "numero_linha", "itinerario", id_linha, nome_linha, numero_linha, itinerario]

    conn.query(insertSql, insertData, (err, data)=> {
        if(err){
            res.status(500).json({message: "Erro ao cadastrar linha"})
            return console.log(err)
        }

        res.status(201).json({message: "linha cadastrada"})
    })
}
export const buscarLinha = (req, res) => { //ok
    const {id_linha} = req.params

    const checkSql = /*sql*/ `
        SELECT * FROM linhas
        WHERE ?? = ?
    `
    const checkData = ["id_linha", id_linha]

    conn.query(checkSql, checkData, (err, data)=> {
        if(err){
            res.status(500).json({message: "Erro ao buscar linhas"})
            return
        }

        if(data.length === 0){
            res.status(404).json({message: "linhas não encontrado"})
            return
        }

        res.status(200).json(data)
    })
}
export const atualizarLinha = (req, res) => { //depende do getOnibus
    const {id_onibus} = req.params
    const {nome_linha, numero_linha, itinerario} = req.body

    if(!nome_linha){
        res.status(400).json({message: "O nome_linha é obrigatório"})
        return
    }
    if(!numero_linha){
        res.status(400).json({message: "O numero_linha é obrigatório"})
        return
    }
    if(!itinerario){
        res.status(400).json({message: "O itinerário é obrigatório"})
        return
    }
    
    const checkSql = /*sql*/ `
    SELECT * FROM onibus 
    WHERE id_onibus = "${id_onibus}"
    `
    
    conn.query(checkSql, (err, data) => {
        if(err){
            res.status(500).json({message: "Erro ao buscar cliente"})
            return
        }

        if(data.length === 0){
            res.status(404).json({message: "linha não encontrada"})
        }

        const updateSql = /*sql*/ `UPDATE onibus SET
        nome_linha = "${nome_linha}", numero_linha = "${numero_linha}", itinerario = "${itinerario}", email = "${email}"
        WHERE id_onibus = "${id_onibus}"
        `

        conn.query(updateSql, (err)=> {
            if(err){
                res.status(500).json({message: "Erro ao atualizar linha"})
                return
            }

            res.status(200).json({message: "linha atualizada"})
        })

    })
}
export const getLinhas = (req, res) => { //ok
    const checkSql = /*sql*/ ` SELECT * FROM linhas;`

    conn.query(checkSql, (err, data)=> {
        if(err){
            res.status(500).json({message: "[linhas] Erro ao buscar dados"})
            return console.log(err)
        }

        if(data.length == 0){
            res.status(404).json({message: "Nenhuma linha encontrada"})
        }

        res.status(200).json({message: '[GET] /linhas', data})
    })
}

