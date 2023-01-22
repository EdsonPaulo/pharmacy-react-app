import { toCamelCase } from '../helpers/objectTransform';
import { UserTypeEnum } from '../typescript/enums';
import { IPerson } from '../typescript/types';
import { APIConnector } from './APIConnector';

export const getPersons = async (
  userType?: UserTypeEnum,
): Promise<IPerson[]> => {
  const response = await APIConnector.get('/person', {
    params: {
      user_type: userType,
    },
  });
  return toCamelCase(response?.data?.data) as IPerson[];
};

interface PersonPayload {
  name: string;
  email: string;
  bi?: string;
  birth_date?: string;
  phone?: string;
  password: string;
  address: null | {
    name: string;
    city: string;
    residence: string;
  };
}

type TPostCreatePerson = (payload: PersonPayload) => Promise<IPerson>;

type TPutEditPerson = (payload: {
  personId: number;
  person: PersonPayload;
  user_type: UserTypeEnum;
}) => Promise<IPerson>;

export const postCreatePerson: TPostCreatePerson = async (payload) => {
  const response = await APIConnector.post('/person', payload);
  return toCamelCase(response.data?.data) as IPerson;
};

export const putEditPerson: TPutEditPerson = async ({ person, personId }) => {
  const response = await APIConnector.put(`/person/${personId}`, person);
  return toCamelCase(response.data?.data) as IPerson;
};

export const deletePerson = async (personId: number) => {
  const response = await APIConnector.delete(`/person/${personId}`);
  return toCamelCase(response.data?.data) as IPerson;
};
