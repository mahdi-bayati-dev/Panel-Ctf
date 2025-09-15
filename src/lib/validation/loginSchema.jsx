import { z } from "zod";

export const loginSchema = z.object({
  // lib/validation/loginSchema.js

  phone: z.string().min(11, "شماره تماس باید حداقل ۱۱ رقم باشد."),

  password: z
    .string()
    .min(8, "رمز عبور باید حداقل ۸ کاراکتر باشد")
    .regex(/[A-Z]/, "حداقل یک حرف بزرگ لازم است")
    .regex(/[a-z]/, "حداقل یک حرف کوچک لازم است")
    .regex(/[0-9]/, "حداقل یک عدد لازم است")
    .regex(/[@$!%*?&]/, "حداقل یک کاراکتر خاص لازم است"),
});
