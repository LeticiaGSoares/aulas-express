import conn from "../config/conn.js"
import moment from 'moment';

export const getEmprestimos = (req, res)=>{
    const sql = /*sql*/ `
        SELECT * FROM emprestimos;
    `
    
    conn.query(sql, (err, data)=> {
        if(err){
            res.status(500).json({message: "Erro ao buscar emprestimos"})
            return;
        }

        const emprestimos = data;
        res.status(200).json({emprestimos: emprestimos});
    });
};

export const cadastrarEmprestimo = (req, res)=> {
    const {cliente_id, livro_id, data_emprestimo, data_devolucao} = req.body

    //validações
    if(!cliente_id){
        res.status(400).json({message: "O id do cliente é obrigatório"})
        return
    }
    if(!livro_id){
        res.status(400).json({message: "O id do livro é obrigatório"})
        return
    }
    if(!data_emprestimo){
        res.status(400).json({message: "A data de imprestimo é obrigatória"})
        return
    }
    if(!data_devolucao){
        res.status(400).json({message: "A data de devolucao é obrigatória"})
        return
    }

    let dataAtual = new Date();
    if(dataAtual.isAfter(data_emprestimo, 'day')){
        console.log('Data de emprestimo precisa estar no futuro')
    }


    const checkClienteExists = /*sql*/ `
    SELECT * FROM clientes
    WHERE ?? = ?
    `;
    const checkClienteExistsData = ["cliente_id", cliente_id]
    conn.query(checkClienteExists, checkClienteExistsData, (err, data)=> {
        if(err){
            res.status(500).json({message: "Erro ao buscar clientes"})
            return console.log(err);
        }

        if(data.length == 0){
            res.status(409).json({message: "Cliente não existe na livraria"})
            return console.log(err);
        }
    })
    

    const checkLivroExists = /*sql*/ `
    SELECT * FROM livros
    WHERE ?? = ?
    `;
    const checkLivroExistsData = ["livro_id", livro_id]
    conn.query(checkLivroExists, checkLivroExistsData, (err, data)=> {
        if(err){
            res.status(500).json({message: "Erro ao buscar livros"})
            return console.log(err);
        }

        if(data.length == 0){
            res.status(409).json({message: "livro não existe na livraria"})
            return console.log(err);
        }
    })



    res.status(201).json({message: validado})

};

export const buscarEmprestimo =(req, res)=> {
    
};

export const editarEmprestimo = (req, res) => {
    
};

export const deletarEmprestimo = (req, res) => {
    
}