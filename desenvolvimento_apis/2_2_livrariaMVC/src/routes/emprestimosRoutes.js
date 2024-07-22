import { Router } from 'express'
import { getEmprestimos, cadastrarEmprestimo, buscarEmprestimo, editarEmprestimo, deletarEmprestimo} from '../controllers/emprestimosController.js';

const router = Router()

router.get('/', getEmprestimos);
router.post('/', cadastrarEmprestimo)
router.get('/emprestimo_id', buscarEmprestimo)
router.put('/editar/emprestimo_id', editarEmprestimo)
router.delete('/deletar/emprestimo_id', deletarEmprestimo)

export default router;