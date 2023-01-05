import * as Yup from 'yup';

const REQUIRED_MESSAGE = 'Campo obrigatório';

export const newProductCategorySchema = Yup.object().shape({
  name: Yup.string().required(REQUIRED_MESSAGE),
});
