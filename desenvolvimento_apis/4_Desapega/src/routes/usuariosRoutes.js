import { Router } from "express";

import { register, login } from "../controllers/usuariosController.js";
import { validarUsuario } from "../helpers/validar-user.js";

const router = Router()

router.post("/register", validarUsuario, register)

router.post("/login", login)

export default router