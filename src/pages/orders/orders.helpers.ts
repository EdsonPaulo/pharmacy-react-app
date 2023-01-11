import * as Yup from 'yup';

const REQUIRED_MESSAGE = 'Campo obrigatório';

export const orderSchema = Yup.object().shape({
  name: Yup.string().min(5, 'Muito curto').required(REQUIRED_MESSAGE),
  address: Yup.object()
    .shape({
      name: Yup.string(),
      city: Yup.string(),
      residence: Yup.string(),
    })
    .nullable(),
});
