// 1 listar todos os emprestismo -npm dayjs (Trabalha com datas)
// 2 vlidar o criarEMprestimo
//     -se o livro existir e o cliente tambem
//     -funcionario nao pode adicionar uma data do emprestimo q seja anterior a data de hoje
//     -data de devolucao não pode ser antes da data de emprestimo
//     -data de devolucao nao pode ser maior que duas semanas

import conn from '../config/conn.js'

const tableEmprestimos = /*sql*/ `
    CREATE TABLE IF NOT EXISTS emprestimos (
        emprestimo_id INT auto_increment PRIMARY KEY,
        cliente_id VARCHAR(60) NOT NULL,
        livro_id VARCHAR(60) NOT NULL,
        data_emprestimo DATETIME NOT NULL,
        data_devolucao DATETIME NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );
`

conn.query(tableEmprestimos, (err)=>{
    if(err){
        console.error("Erro ao criar a tabela "+ err.stack)
        return
    }
    console.log('Tabela [emprestimos] criada com sucesso')
})