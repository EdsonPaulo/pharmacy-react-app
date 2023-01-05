import * as Yup from 'yup';

const REQUIRED_MESSAGE = 'Campo obrigatório';

export const employeeSchema = Yup.object().shape({
  name: Yup.string().min(5, 'Muito curto').required(REQUIRED_MESSAGE),
  bi: Yup.string(),
  birth_date: Yup.string(),
  phone: Yup.string(),
  password: Yup.string().min(6, 'Muito curto').required(REQUIRED_MESSAGE),
  email: Yup.string().email('Email inválido').required(REQUIRED_MESSAGE),
  address: Yup.object()
    .shape({
      name: Yup.string(),
      city: Yup.string(),
      residence: Yup.string(),
    })
    .nullable(),
});
