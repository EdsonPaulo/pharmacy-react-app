import { PersonPage } from '../person';
import { UserTypeEnum } from '../../typescript/enums';

export const CustomersPage = () => {
  return <PersonPage personType={UserTypeEnum.CUSTOMER} />;
};
