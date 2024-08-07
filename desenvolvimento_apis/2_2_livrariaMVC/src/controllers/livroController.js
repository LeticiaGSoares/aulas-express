import conn from "../config/conn.js";
import {v4 as uuidv4} from 'uuid';

export const getLivros = (req, res)=>{
    const sql = /*sql*/ `
        SELECT * FROM livros;
    `
    
    conn.query(sql, (err, data)=> {
        if(err){
            res.status(500).json({message: "Erro ao buscar livros"})
            return;
        }

        const livros = data;
        res.status(200).json({livros: livros});
    });
};

export const cadastrarLivros = (req, res)=> {
    
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
    WHERE ?? = ? AND 
    ?? = ? AND 
    ??= ?
    `;

    const checkSqlData = ["titulo", titulo, "autor", autor, "ano_publicacao",ano_publicacao]

    conn.query(checkSql, checkSqlData, (err, data)=> {
        if(err){
            res.status(500).json({message: "Erro ao buscar os livros"})
            return console.log(err);
        }

        if(data.length > 0){
            res.status(409).json({message: "Livro já existe na livraria"})
            return console.log(err);
        }
    })

    const livro_id = uuidv4()
    const disponibilidade = 1
    const insertSql = /*sql*/ `
    INSERT INTO livros 
    (??, ??, ??, ??, ??, ??, ??)
    VALUES
    (?,?,?,?,?,?,?)
    `
    const insertSqlData = [
        "livro_id", "titulo", "autor", "ano_publicacao", "genero", "preco", "disponibilidade", 
        livro_id, titulo, autor, ano_publicacao, genero, preco, disponibilidade
    ]
    conn.query(insertSql, insertSqlData, (err)=> {
        if(err){
            res.status(500).json({message: "Erro ao cadastrar os livros"})
            return console.log(err);
        }

        res.status(201).json({message: "Livro cadastrado"})
    })
};

export const buscarLivro =(req, res)=> {
    const {livro_id} = req.params

    const checkSql = /*sql*/ `
    SELECT * FROM livros 
    WHERE ?? = ?`

    const checkSqlData = ["livro_id", livro_id]

    conn.query(checkSql, checkSqlData, (err, data) => {
        if(err){
            res.status(500).json({message: "Erro ao buscar livro"})
            return
        }

        if(data.length === 0){
            res.status(404).json({message: "Livro não encontrado"})
        }

        res.status(200).json(data)
    })
};

export const editarLivro = (req, res) => {
    const {livro_id} = req.params
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
    WHERE ??= ?`
    
    const checkSqlData = ["livro_id", livro_id]


    conn.query(checkSql, checkSqlData, (err, data) => {
        if(err){
            res.status(500).json({message: "Erro ao buscar livro"})
            return
        }

        if(data.length === 0){
            res.status(404).json({message: "Livro não encontrado"})
        }

        //Consulta SQL para atualizar livro
        const updateSql = /*sql*/ `UPDATE livros SET
        ?? = ?, ?? = ?, ?? = ?,
        ?? = ?, ?? = ?, ?? = ?
        WHERE ?? = ?
        `
        const updateSqlData = [
            "titulo", titulo, 
            "autor", autor, 
            "ano_publicacao", ano_publicacao, 
            "genero", genero, 
            "preco", preco, 
            "disponibilidade", disponibilidade,
            "livro_id", livro_id
        ]
        conn.query(updateSql, updateSqlData, (err)=> {
            if(err){
                res.status(500).json({message: "Erro ao atualizar livro"})
                return
            }
            
            res.status(200).json(data)
        })                                                                                                                                                                                                                                                                
        
    })
};

export const deletarLivro = (req, res) => {
    const {livro_id} = req.params

    const deleteSql = /*sql*/ `DELETE FROM livros WHERE ?? = ?`
    const deleteSqlData = ["livro_id", livro_id]

    conn.query(deleteSql, deleteSqlData, (err, info)=> {
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
}