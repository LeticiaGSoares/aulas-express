import { Router } from 'express'
import { getFuncionarios, cadastrarFuncionario, buscarFuncionario, editarFuncionario, deletarFuncionario} from '../controllers/funcionarioController.js';

const router = Router()

router.get('/', getFuncionarios);
router.post('/', cadastrarFuncionario)
router.get('/:func_id', buscarFuncionario)
router.put('/editar/:func_id', editarFuncionario)
router.delete('/deletar/:func_id', deletarFuncionario)

export default router;