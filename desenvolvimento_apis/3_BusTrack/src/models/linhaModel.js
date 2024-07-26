import conn from '../config/conn.js'

const tableLinhas = /*sql*/ `
    CREATE TABLE IF NOT EXISTS linhas (
        id_linha VARCHAR(60) PRIMARY KEY ,
        nome_linha VARCHAR(255) NOT NULL,
        numero_linha INT NOT NULL,
        itinerario VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );
`

conn.query(tableLinhas, (err)=> {
    if(err){
        console.error("Erro ao criar a tabela "+ err.stack)
        return
    }
    console.log('Tabela [linhas] criada com sucesso')
})