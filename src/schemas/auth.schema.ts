import { z } from 'zod';
const userRegistrationSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
});

const userLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export { userRegistrationSchema, userLoginSchema };
