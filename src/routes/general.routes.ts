import { Router } from 'express';
import { generalHandler } from '../controllers/general.controller';

const router = Router();

router.post('', generalHandler);

export default router;
