import jwt from "jsonwebtoken"

const createUserToken = async (usuario, req, res) => {
    const token = jwt.sign({
        nome: usuario.nome,
        id: usuario.usuario_id
    },
    process.env.JWT_PASSWORD
    )

    res.json({
        message: "Você está logado",
        token: token,
        usuarioID: usuario.usuario_id
    })
}

export default createUserToken