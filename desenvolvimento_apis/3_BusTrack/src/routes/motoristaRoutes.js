import { Router } from 'express'
import {cadastrarMotorista, buscarMotorista, deletarMotorista, getMotoristas} from '../controllers/motoristaControllers.js'

const router = Router()

router.post('/', cadastrarMotorista);
router.get('/:id_onibus', buscarMotorista)
router.delete('/:id_onibus', deletarMotorista)
router.get('/', getMotoristas)

export default router;