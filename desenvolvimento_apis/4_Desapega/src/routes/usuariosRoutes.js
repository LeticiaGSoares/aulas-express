import { Router } from "express";

import { register, login, getUser } from "../controllers/usuariosControllers.js";
import { validarUsuario } from "../helpers/validar-user.js";

const router = Router()

router.post("/register", validarUsuario, register)

router.post("/login", login)

router.get("/:id", getUser)

export default router