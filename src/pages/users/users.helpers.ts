import * as Yup from 'yup';

import { UserTypeEnum } from '../../typescript/enums';

const REQUIRED_MESSAGE = 'Campo obrigatório';

export const UserTypesMap: Record<UserTypeEnum, string> = {
  customer: 'Cliente',
  admin: 'Administrador',
  employee: 'Funcionário',
};

export const newUserSchema = Yup.object().shape({
  name: Yup.string().min(5, 'Muito curto').required(REQUIRED_MESSAGE),
  password: Yup.string().min(6, 'Muito curto').required(REQUIRED_MESSAGE),
  email: Yup.string().email('Email inválido').required(REQUIRED_MESSAGE),
  user_type: Yup.mixed()
    .oneOf(Object.values(UserTypeEnum))
    .nullable()
    .required(REQUIRED_MESSAGE),
});
