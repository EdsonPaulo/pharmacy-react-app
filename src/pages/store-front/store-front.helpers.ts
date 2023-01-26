import * as Yup from 'yup';

const REQUIRED_MESSAGE = 'Campo obrigatório';

const SelectValueType = Yup.object().shape({
  value: Yup.number(),
  label: Yup.string(),
});

export const orderSchema = Yup.object().shape({
  observation: Yup.string(),
  products: Yup.array().of(
    Yup.object().shape({
      value: Yup.number(),
      label: Yup.string(),
      category: Yup.string().nullable(),
      quantity: Yup.number(),
    }),
  ),
  order_date: Yup.string(),
  fk_customer: SelectValueType.nullable().required(REQUIRED_MESSAGE),
  fk_address: SelectValueType.nullable().required(REQUIRED_MESSAGE),
  fk_employee: SelectValueType.nullable().required(REQUIRED_MESSAGE),
});

export const formatDate = (date: string | Date) => {
  return new Intl.DateTimeFormat('pt-PT', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date));
};
