import conn from '../config/conn.js'

const tableMotoristas = /*sql*/ `
    CREATE TABLE IF NOT EXISTS motoristas (
        id_motorista VARCHAR(60) PRIMARY KEY,
        nome VARCHAR(255) NOT NULL,
        data_nascimento DATE NOT NULL,
        numero_carteira_habilitacao VARCHAR(9) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );
`

conn.query(tableMotoristas, (err)=> {
    if(err){
        console.error("Erro ao criar a tabela "+ err.stack)
        return
    }
    console.log('Tabela [motoristas] criada com sucesso')
})