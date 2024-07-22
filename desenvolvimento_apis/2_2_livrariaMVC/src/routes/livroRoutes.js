import { Router } from 'express'
import { getLivros, cadastrarLivros, buscarLivro, editarLivro, deletarLivro} from '../controllers/livroController.js';

const router = Router()

router.get('/', getLivros);
router.post('/', cadastrarLivros)
router.get('/:livro_id', buscarLivro)
router.put('/editar/:livro_id', editarLivro)
router.delete('/deletar/:livro_id', deletarLivro)

export default router;