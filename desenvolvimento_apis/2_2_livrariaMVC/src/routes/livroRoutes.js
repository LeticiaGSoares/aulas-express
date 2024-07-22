import { Router } from 'express'
import { getLivros, cadastrarLivros, buscarLivro, editarLivro, deletarLivro} from '../controllers/livroController.js';

const router = Router()

router.get('/', getLivros);
router.post('/', cadastrarLivros)
router.get('/:id', buscarLivro)
router.put('/editar/:id', editarLivro)
router.delete('/deletar/:id', deletarLivro)

export default router;