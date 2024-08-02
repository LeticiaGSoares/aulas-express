import jwt from 'jsonwebtoken'
import getToken from './get-token.js'
import "dotenv/config" 

const verifyToken = (req, res, next) => {
    
    if(!req.headers.authorization){
        res.status(401).json({erro: "Acesso negado"})
        return
    }
    
    const token = getToken(req)
    if(!token){
        res.status(401).json({erro: "Acesso negado"})
        return
    }
    //verifica se o token existe/é válido
    try {
        const verified = jwt.verify(token, process.env.JWT_PASSWORD)
    } catch (error) {
        res.status(400).json({err: "Token Inválido"})
    }

    //verifica de que usuário é o token
    
    //verifica se o id passado do usuário tem o mesmo token 


    next()
}

export default verifyToken