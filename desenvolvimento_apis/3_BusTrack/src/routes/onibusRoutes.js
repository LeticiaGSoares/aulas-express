import { Router } from 'express'
import {cadastrarOnibus, buscarOnibus, getOnibus} from '../controllers/onibusControllers.js'

const router = Router()

router.post('/', cadastrarOnibus);
router.get('/:id_onibus', buscarOnibus)
router.get('/', getOnibus)

export default router;