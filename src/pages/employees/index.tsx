import { PersonPage } from '../../components/person';
import { UserTypeEnum } from '../../typescript/enums';

export const EmployeesPage = () => {
  return <PersonPage personType={UserTypeEnum.EMPLOYEE} />;
};
