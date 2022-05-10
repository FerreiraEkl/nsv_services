import { Router } from 'express';
import documentController from '../../controllers/documentController';

const documentRoutes = Router();

documentRoutes.post('/search', documentController.searchDocuments);

export default documentRoutes;