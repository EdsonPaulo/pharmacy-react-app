import * as Yup from 'yup';

const REQUIRED_MESSAGE = 'Campo obrigatório';

const SelectValueType = Yup.object().shape({
  value: Yup.number(),
  label: Yup.string(),
});

export const purchaseSchema = Yup.object().shape({
  purchase_date: Yup.string(),
  quantity: Yup.number(),
  observation: Yup.string(),
  fk_supplier: SelectValueType.nullable().required(REQUIRED_MESSAGE),
  fk_employee: SelectValueType.nullable().required(REQUIRED_MESSAGE),
  fk_product: SelectValueType.nullable().required(REQUIRED_MESSAGE),
});

export const formatDate = (date: string | Date) => {
  return new Intl.DateTimeFormat('pt-PT', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date));
};
