import conn from '../config/conn.js'

const tableOnibus = /*sql*/ `
    CREATE TABLE IF NOT EXISTS onibus (
        id_onibus VARCHAR(60) PRIMARY KEY,
        placa VARCHAR(8),
        modelo VARCHAR(255),
        ano_fabricacao INT NOT NULL,
        capacidade INT NOT NULL,
        id_linha VARCHAR(60),
        id_motorista VARCHAR(60),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
        FOREIGN KEY (id_linha) REFERENCES linhas(id_linha),
        FOREIGN KEY (id_motorista) REFERENCES motoristas(id_motorista)
    );
`

conn.query(tableOnibus, (err)=> {
    if(err){
        console.error("Erro ao criar a tabela "+ err.stack)
        return
    }
    console.log('Tabela [onibus] criada com sucesso')
})