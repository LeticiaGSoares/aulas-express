import jwt from "jsonwebtoken"
import 'dotenv/config'
import { table_mysql } from "../models/usuarioModel.js"
import conn from "../config/conn.js"


//tem que usar async pq lá tá chamando com await essa porra aprenda cacete
const getUserByToken = async (token) => {
    return new Promise((resolve, reject)=> {
        if(!token){
            res.status(401).json({err: "Acesso negado"})
            return
        }

        const decoded = jwt.verify(token, process.env.JWT_PASSWORD)
        // console.log("decoded: ", decoded)
        const userId = decoded.id
        console.log("userId: ", userId)

        const checkSql = /*sql*/ `SELECT * FROM ${table_mysql} WHERE ?? = ?`
        const checkData = ["usuario_id", userId]

        conn.query(checkSql, checkData, (err, data)=> {
            if (err) {
                res.status(401).json({ message: "Não foi possivel buscar usuário, error: " + err });
                return;
            }

            if (data.length === 0){
                res.status(404).json({ message: "Usuário não encontrado"});
                return;
            }

            // res.status(200).json(data)
            resolve(data)
        })
    })
}

export default getUserByToken