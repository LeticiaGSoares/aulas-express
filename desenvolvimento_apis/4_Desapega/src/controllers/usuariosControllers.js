import bcrypt from "bcrypt";
import { v4 } from "uuid";
import conn from "../config/conn.js";
import jwt from "jsonwebtoken"

import { table_mysql } from "../models/usuarioModel.js";

import createUserToken from "../helpers/create-user-token.js";
import getToken from "../helpers/get-token.js";
import verifyToken from '../helpers/verify-token.js'
import getUserByToken from '../helpers/get-user-by-token.js'


export const register = (req, res) => {
  const { nome, email, telefone, senha } = req.body;

  const checkEmailSql = /*sql*/ `
        SELECT * FROM ${table_mysql} 
        WHERE ?? = ? 
    `;

  const checkEmailSqlData = ["email", email];

  conn.query(checkEmailSql, checkEmailSqlData, async (err, data) => {
    if (err) {
      res
        .status(500)
        .json({ message: "Não foi possivel buscar usuário, error: " + err });
      return;
    }

    if (data > 0) {
      res.status(500).json({ message: "E-mail já está em uso, error: " + err });
      return;
    }

    const salt = await bcrypt.genSalt(12);
    const senhaHash = await bcrypt.hash(senha, salt);

    const id = v4();
    const imagem = "userDefault.png";

    const insertSql = /*sql*/ `
        INSERT INTO ${table_mysql} 
        (??, ??, ??, ??, ??, ??) VALUES (?, ?, ?, ?, ?, ?)
    `;

    const insertSqlData = [
      "usuario_id",
      "nome",
      "email",
      "telefone",
      "senha",
      "imagem",
      id,
      nome,
      email,
      telefone,
      senhaHash,
      imagem,
    ];

    conn.query(insertSql, insertSqlData, (err, data) => {
      if (err) {
        res
          .status(500)
          .json({ message: "Erro ao cadastrar usuário, error: " + err });
        return;
      }

      const usuarioSql = /*sql*/ `
          SELECT * FROM usuarios WHERE ?? = ?
        `;

      const usuarioSqlData = ["usuario_id", id];

      conn.query(usuarioSql, usuarioSqlData, async (err, data) => {
        if (err) {
          res
            .status(500)
            .json({ message: "Erro ao selecionar usuário " + err });
          return;
        }

        const usuario = data[0];

        try {
          await createUserToken(usuario, req, res);
        } catch (error) {
          console.log(error);
        }
      });
    });
  });
};

export const login = (req, res) => {
  const { email, senha } = req.body;

  if (!email) {
    res.status(400).json({ message: "O email é obrigatorio!" });
  }
  if (!senha) {
    res.status(400).json({ message: "A senha é obrigatoria!" });
  }

  const checkSql = /*sql*/ `
    SELECT * FROM ${table_mysql} WHERE ?? = ?
  `;
  const checkSqlData = ["email", email];

  conn.query(checkSql, checkSqlData, async (err, data) => {
    if (err) {
      res
        .status(500)
        .json({ message: "Não foi possivel buscar usuário, error: " + err });
      return;
    }

    if (data.length == 0) {
      res.status(404).json({ message: "Usuário não encontrado" });
      return;
    }

    const usuario = data[0]

    const compararSenha = await bcrypt.compare(senha, usuario.senha)

    if (!compararSenha) {
      return res.status(401).json({ message: "Senha inválida" })
    }

    try {
      await createUserToken(usuario, req, res)
    } catch (error) {
      console.log(error)
      res.status(500).json({ message: "Erro ao comparar informação" })
    }

    console.log(senha),
    console.log(usuario.senha)
    console.log(compararSenha)
  });
};

export const getUser = (req, res) => {
  if (req.headers.authorization) {
    const token = getToken(req)

    const decoded = jwt.decode(token, process.env.JWT_PASSWORD)
    console.log(decoded)
  }
}

export const getUserById = (req, res)=>{
  const {id} = req.params

  const checkSql = /*sql*/`
    SELECT usuario_id, nome, email, telefone, imagem
    FROM ${table_mysql}
    WHERE ?? = ?
  `

  const checkData = ["usuario_id", id]

  conn.query(checkSql, checkData, (err, data)=>{
    if(err){
      console.error(err)
      res.status(500).json({err: "Erro ao buscar usuários"})
      return
    }
    
    if(data.length === 0){
      res.status(500).json({err: "Erro ao buscar usuários"})
      return
    }

    const usuario = data[0]
    res.status(200).json(usuario)
  })
}

export const updateUser = async (req, res) => {
  const {id} = req.params

  //verificar se o usuario está logado
  try{
    const token = getToken(req)
    //busca dados no banco, devolve e faz uma nova consulta ao banco
    //por ter muitas consultas pode demorar, então vai de await neles
    // console.log("token: ", token)
    const user = await getUserByToken(token)
    // console.log("user: ",user)

    const {nome, email, telefone} = req.body

    if(!nome){
      res.status(400).json({message: "O nome é obrigatório"})
      return
    }
    if(!email){
      res.status(400).json({message: "O email é obrigatório"})
      return
    }
    if(!telefone){
      res.status(400).json({message: "O telefone é obrigatório"})
      return
    }

    const checkSql = /*sql*/ `SELECT * FROM ${table_mysql} WHERE ?? = ?`
    const checkData = ["usuario_id", id]

    conn.query(checkSql, checkData, (err, data)=> {
      if(err){
        res.status(500).json({erro: err})
        return
      }
      if(data.length === 0){
        res.status(404).json({message: "Usuário não encontrado"})
        return
      }

      //verifica se o email já está em uso.
      const checkEmailSql = /*sql*/ `
        SELECT * FROM ${table_mysql} 
        WHERE ?? = ? AND ?? != ?
      `
      const checkEmailSqlData = ["email", email, "usuario_id", id]

      conn.query(checkEmailSql, checkEmailSqlData, (err, data)=>{
        if(err){
          res.status(500).json({erro: "Erro ao buscar email"})
          return
        }
        if(data.length > 0){
          res.status(409).json({message: "Email já está em uso"})
          return
        }

        const updateSql = /*sql*/ `
          UPDATE ${table_mysql}
          SET ? WHERE ?? = ?
        `
        //colocando apenas uma ? pq ele vai pegar um objeto
        const updateData = [{nome, email, telefone}, "usuario_id", id]

        conn.query(updateSql, updateData, (err)=>{
          if(err){
            console.error(err)
            res.status(500).json({err: "Erro ao atualizar usuário"})
            return
          }

          res.status(200).json({message: `[${table_mysql}] atualizado`})
        })
      })
    })


    res.status(200).json({message: "Deu tudo ok"})
  
  }catch(error){
    res.status(500).json({err: error})
  }
  
}