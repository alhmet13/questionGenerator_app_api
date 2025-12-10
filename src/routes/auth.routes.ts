import { Router } from 'express';
import { signInHandler, singUpHandler, refreshTokenHandler } from '../controllers/auth.controller';
import { validate } from '../middlewares';
import { userLoginSchema, userRegistrationSchema } from '../schemas';

const router = Router();

router.post('/sign-up', validate(userRegistrationSchema), singUpHandler);
router.post('/sign-in', validate(userLoginSchema), signInHandler);
router.post('/refresh', refreshTokenHandler);

export default router;
