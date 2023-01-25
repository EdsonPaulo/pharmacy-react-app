import * as Yup from 'yup';

const REQUIRED_MESSAGE = 'Campo obrigatório';

export const supplierSchema = Yup.object().shape({
  name: Yup.string()
    .min(5, 'Nome muito curto')
    .max(60, 'Nome muito longo')
    .required(REQUIRED_MESSAGE),
  phone: Yup.string()
    .min(9, 'Deve ter no mínimo 9 dígitos')
    .max(12, 'Deve ter no máximo 12 dígitos')
    .matches(/^\d+$/, 'Digite um número de telefone válido!'),
  email: Yup.string()
    .email('Digite um email válido')
    .required(REQUIRED_MESSAGE),
  nif: Yup.string(),
  address: Yup.object()
    .shape({
      name: Yup.string(),
      city: Yup.string(),
      residence: Yup.string(),
    })
    .nullable(),
});
