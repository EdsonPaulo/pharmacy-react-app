import { toCamelCase } from '../helpers/objectTransform';
import { IStatistics } from '../typescript/types';
import { APIConnector } from './APIConnector';

export const getStatistics = async (): Promise<IStatistics> => {
  const response = await APIConnector.get('/statistics');
  return toCamelCase(response.data?.data) as IStatistics;
};
