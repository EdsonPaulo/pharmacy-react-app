import * as Yup from 'yup';

const REQUIRED_MESSAGE = 'Campo obrigatório';

export const newProductSchema = Yup.object().shape({
  name: Yup.string().required(REQUIRED_MESSAGE),
  price: Yup.number().required(REQUIRED_MESSAGE),
  stock: Yup.number().required(REQUIRED_MESSAGE),
  description: Yup.string().required(REQUIRED_MESSAGE),
  manufacture_date: Yup.string().required(REQUIRED_MESSAGE),
  expiration_date: Yup.string().required(REQUIRED_MESSAGE),
  fk_product_category: Yup.number().required(REQUIRED_MESSAGE),
});
