import { PersonPage } from '../../components/person';
import { UserTypeEnum } from '../../typescript/enums';

export const CustomersPage = () => {
  return <PersonPage personType={UserTypeEnum.CUSTOMER} />;
};
