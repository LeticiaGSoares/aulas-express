import { Router } from 'express'
import { getClientes, cadastrarCliente, buscarCliente, editarCliente, deletarCliente} from '../controllers/clienteController.js';

const router = Router()

router.get('/', getClientes);
router.post('/', cadastrarCliente)
router.get('/:id', buscarCliente)
router.put('/editar/:id', editarCliente)
router.delete('/deletar/:id', deletarCliente)

export default router;