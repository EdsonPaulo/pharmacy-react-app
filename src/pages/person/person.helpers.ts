import * as Yup from 'yup';

const REQUIRED_MESSAGE = 'Campo obrigatório';

export const personSchema = Yup.object().shape({
  name: Yup.string()
    .matches(/^[a-zA-Z ]*$/, 'O nome só pode conter letras')
    .strict()
    .min(6, 'Nome muito curto')
    .max(60, 'Nome muito longo')
    .required(REQUIRED_MESSAGE),
  bi: Yup.string(),
  birth_date: Yup.string(),
  phone: Yup.string()
    .length(9, 'Deve ter 9 dígitos')
    .matches(/^\d+$/, 'Digite um número de telefone válido!'),
  password: Yup.string().min(6, 'Senha muito fraca').required(REQUIRED_MESSAGE),
  email: Yup.string()
    .email('Digite um email válido')
    .required(REQUIRED_MESSAGE),
  user_type: Yup.string().required(REQUIRED_MESSAGE),
  address: Yup.object()
    .shape({
      name: Yup.string(),
      city: Yup.string(),
      residence: Yup.string(),
    })
    .nullable(),
});
