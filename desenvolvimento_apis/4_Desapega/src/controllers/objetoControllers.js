import getToken from "../helpers/get-token.js"
import getUserByToken from "../helpers/get-user-by-token.js"
import {v4 as uuidv4} from 'uuid'
import conn from "../config/conn.js"

export const create = async (req, res) => {
    const {nome, peso, cor, descricao} = req.body
    const disponibilidade = 1

    //buscar o token do usuario cadastrado

    const token = getToken(req)
    const user = await getUserByToken(token)

    if(!nome || nome.length <3){
        res.status(400).json({message: "O nome é obrigatório e deve ter pelo menos 3 caracteres"})
        return
    }

    if(!cor){
        res.status(400).json({message: "A cor é obrigatória"})
        return
    }

    if(!peso){
        res.status(400).json({message: "O peso é obrigatório"})
        return
    }
    
    if(!descricao){
        res.status(400).json({message: "A descricao é obrigatória"})
        return
    }

    const objeto_id = uuidv4()
    const usuario_id = user.usuario_id
    const insertSql = /*sql*/`
        INSERT INTO objetos 
        (??, ??, ??, ??, ??, ??, ??) 
        VALUES 
        (?, ?, ?, ?, ?, ?, ?)
    `;

    const insertData = [
        "objeto_id", "nome", "peso", "cor", "descricao", "disponibilidade", "usuario_id",
        objeto_id, nome, peso, cor, descricao, disponibilidade, usuario_id
    ]

    conn.query(insertSql, insertData, (err, data)=>{
        if(err){
            console.error(err)
            res.status(500).json({err: "Erro ao cadastrar objeto"})
            return
        }
    })

    if(req.files){
        //cadastrar no banco

        const insertImageSql = /*sql*/`
            INSERT INTO objeto_images 
            (image_id, objeto_id, image_path)
            VALUES ?
        `

        const imageValues = req.files.map((file) => [
            uuidv4(),
            objeto_id,
            file.filename
        ])
        
        conn.query(insertImageSql, [imageValues], (err)=> {
            if(err){
                console.error(err)
                res.status(500).json({err: "Erro ao salvar imagens do objeto"})
                return
            }

            res.status(201).json("Objeto cadastrado com sucesso")
        })

    }else{
        res.status(201).json("Objeto cadastrado com sucesso")
    }
}

export const getAllObjectUser = async (req, res) => {
    try{
        const token = getToken(req)
        const user = await getUserByToken(token)

        const usuarioId = user.usuario_id
        const selectSql = /*sql*/`
            SELECT 
                obj.objeto_id,
                obj.usuario_id,
                obj.nome,
                obj.peso,
                obj.cor,
                obj.descricao
                GROUP_CONCAT(obj_img.image_path SEPARATOR ',') AS image_path
            FROM 
                objetos AS obj
            LEFT JOIN
                objeto_images AS 
                obj_img ON 
                obj.objeto_id = obj_img.objeto_id
            WHERE
                obj.usuario_id = ?
            GROUP BY
                obj.objeto_id, 
                obj.usuario_id, 
                obj.nome, 
                obj.peso, 
                obj.cor,
                obj.descricao
        `

        conn.query(selectSql, [usuarioId], (err, data)=>{
            if(err){
                console.error()
                return
            }
        })

    } catch (error) {

    }
}