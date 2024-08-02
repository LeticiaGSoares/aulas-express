import { Router } from "express";

import { register, login, getUser, getUserById, updateUser} from "../controllers/usuariosControllers.js";
import { validarUsuario } from "../helpers/validar-user.js";
import verifyToken from "../helpers/verify-token.js";

const router = Router()

router.post("/register", validarUsuario, register)
router.post("/login", login)
// router.get("/:id", getUser)
router.get("/:id", getUserById)

//só permitir que edite se o user estiver logado e pode fazer upload de imagem de perfil
router.put("/update/:id", verifyToken, updateUser)

export default router