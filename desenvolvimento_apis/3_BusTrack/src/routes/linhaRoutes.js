import { Router } from 'express'
import {cadastrarLinha, buscarLinha, atualizarLinha, getLinhas} from '../controllers/linhaControllers.js'

const router = Router()

router.post('/', cadastrarLinha);
router.get('/:id_linha', buscarLinha)
router.put('/:id_linha', atualizarLinha)
router.get('/', getLinhas)

export default router;