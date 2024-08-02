import conn from "../config/conn.js"

export const table_mysql = 'usuarios'

const tableUsuarios = /*sql*/ `
    CREATE TABLE IF NOT EXISTS ${table_mysql} (
        usuario_id VARCHAR(50) PRIMARY KEY,
        nome VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        telefone VARCHAR(255) NOT NULL,
        senha VARCHAR(255) NOT NULL,
        imagem VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );
`

conn.query(tableUsuarios, (err) => {
    if (err) {
        console.error(err)
        return
    }

    console.log(`[usuarios] Tabela criada`)
})