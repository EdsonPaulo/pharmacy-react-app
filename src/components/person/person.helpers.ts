import * as Yup from 'yup';

const REQUIRED_MESSAGE = 'Campo obrigatório';

export const personSchema = Yup.object().shape({
  name: Yup.string()
    .strict()
    .min(5, 'Nome muito curto')
    .max(60, 'Nome muito longo')
    .required(REQUIRED_MESSAGE)
    .typeError('Digite um número de telefone válido!'),
  bi: Yup.string(),
  birth_date: Yup.string(),
  phone: Yup.number()
    .strict()
    .typeError('Digite um número de telefone válido!'),
  password: Yup.string().min(6, 'Senha muito fraca').required(REQUIRED_MESSAGE),
  email: Yup.string()
    .email('Digite um email válido')
    .required(REQUIRED_MESSAGE),
  address: Yup.object()
    .shape({
      name: Yup.string(),
      city: Yup.string(),
      residence: Yup.string(),
    })
    .nullable(),
});
