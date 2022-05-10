import { Router } from 'express';
import documentRoutes from './apiRoutes/document.routes';

const routes = Router();

routes.use('/document', documentRoutes);

export default routes;