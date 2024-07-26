import 'dotenv/config'
import mysql from "mysql2";

const conn = mysql.createPool({
    connectionLimit: 10, //apenas 10 requisições por vez
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER, 
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    port: process.env.MYSQL_PORT
})

export default conn;