import { Router } from 'express'
import { getFuncionarios, cadastrarFuncionario, buscarFuncionario, editarFuncionario, deletarFuncionario} from '../controllers/funcionarioController.js';

const router = Router()

router.get('/', getFuncionarios);
router.post('/', cadastrarFuncionario)
router.get('/:id', buscarFuncionario)
router.put('/editar/:id', editarFuncionario)
router.delete('/deletar/:id', deletarFuncionario)

export default router;