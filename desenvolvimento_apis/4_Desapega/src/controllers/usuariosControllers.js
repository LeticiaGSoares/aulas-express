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

export const updateUser = async (request, response) => {
  const { id } = request.params;

  //verificar se o usuário está logado
  try {
    const token = getToken(request);
    const user = await getUserByToken(token);

    const { nome, email, telefone } = request.body;

    //adicionar imagem ao objeto
    let imagem = user.imagem
    if(request.file){
      imagem = request.file.filename
    }

    if (!nome) {
      response.status(400).json({ message: "O nome é Obrigatório" });
      return;
    }

    if (!email) {
      response.status(400).json({ message: "O Email é Obrigatório" });
      return;
    }

    if (!telefone) {
      response.status(400).json({ message: "O Telefone é Obrigatório" });
      return;
    }

    const checkSql = /*sql*/ `SELECT * FROM usuarios WHERE ?? = ?`;
    const checkData = ["usuario_id", id];
    conn.query(checkSql, checkData, (err, data) => {
      if (err) {
        console.error(err);
        response.status(500).json({ err: "Erro ao buscar usuário" });
        return;
      }

      if (data.length === 0) {
        response.status(404).json({ err: "Usuário não encontrado" });
        return;
      }

      //validação de usuário do banco é o mesmo do token

      //verifique se o email já está em uso.
      const checkEmailSql = /*sql*/ `SELECT * FROM usuarios WHERE ?? = ? AND ?? != ?`;
      const checkEmailData = ["email", email, "usuario_id", id];
      conn.query(checkEmailSql, checkEmailData, (err, data) => {
        if (err) {
          console.error(err);
          resquest.status(500).json({ err: "Erro ao buscar email" });
          return;
        }
        
        if(data.length > 0){
          response.status(409).json({ err: "E-mail já está em uso" });
          return;
        }

        const updateSql = /*sql*/ `UPDATE usuarios SET ? WHERE ?? = ?`
        const updateData = [{nome, email, telefone, imagem}, "usuario_id", id]
        conn.query(updateSql, updateData, (err)=>{
          if(err){
            console.error(err);
            response.status(500).json({ err: "Erro ao atualizar usuário"});
            return;
          }

          response.status(200).json({message: "Usuário Atualizado"})
        })
      });
    });
  } catch (error) {
    console.error(error)
    response.
    status(error.status || 500).
    json({
      message: error.message || "Erro interno no servidor"
    });
  }
};