import { AbstractDTO } from "../../utils/abstract.dto";
import { z } from "zod";

export const authRegisterSchema = z
  .object({
    name: z
      .string()
      .min(1, { message: 'Você deve preencher o nome' })
      .regex(
        /^([a-zA-Z]{2,}\s[a-zA-Z]{1,}'?-?[a-zA-Z]{2,}\s?([a-zA-Z]{1,})?)/,
        {
          message: 'Digite o nome completo',
        },
      ),
    email: z
      .string()
      .min(1, { message: 'Você deve preencher o e-mail' })
      .email({
        message: 'Deve ser um e-mail válido',
      }),
    password: z
      .string()
      .min(6, { message: 'Senha deve possuir pelo menos 6 caracteres' })
      .regex(/.*[A-Z].*/, 'Deve possuir uma letra maiúscula')
      .regex(/.*[a-z].*/, 'Deve possuir uma letra minuscula')
      .regex(/.*\d.*/, 'Deve possuir um número')
      .regex(/[!@#$%^&*]+/, 'Deve possuir um caractere especial(!@#$%^&*)'),
    passwordConfirmation: z.string(),
    role: z.enum(['USER', 'ADMIN']),
  })
  .refine(data => data.password === data.passwordConfirmation, {
    message: 'Deve ser o mesmo valor da senha',
    path: ['passwordConfirmation'],
  });

export class AuthRegisterRequestDTO extends AbstractDTO<typeof authRegisterSchema> {
    protected rules() {
        return authRegisterSchema
    }
}