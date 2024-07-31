export const validarUsuario = async (req, res, next) => {
    const { nome, email, telefone, senha, confirm_senha } = req.body;

    if(!nome) {
        res.status(400).json({ message: "O nome é obrigatório" })
        return
    }

    if(!email) {
        res.status(400).json({ message: "O email é obrigatório" })
        return
    }

    if(!telefone) {
        res.status(400).json({ message: "O telefone é obrigatório" })
        return
    }

    if(!senha) {
        res.status(400).json({ message: "O senha é obrigatório" })
        return
    }

    if(!confirm_senha) {
        res.status(400).json({ message: "O confirmar senha é obrigatório" })
        return
    }

    if (senha !== confirm_senha) {
        res.status(409).json({ message: "A senha e confirmação de senha devem ser iguais" })
        return
    }

    next()
}