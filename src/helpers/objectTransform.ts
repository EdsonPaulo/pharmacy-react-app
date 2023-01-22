import camelCase from 'lodash/camelCase';
import isArray from 'lodash/isArray';
import isObject from 'lodash/isObject';
import transform from 'lodash/transform';

export const toCamelCase = (obj = {} as any) =>
  transform(
    obj,
    (acc: Record<string, any>, value: any, key: any, target: any) => {
      const camelKey = isArray(target) ? key : camelCase(key);

      acc[camelKey] = isObject(value) ? toCamelCase(value) : value;
    },
  );

export const groupElementsBy = (
  elements: Array<Record<string, any>>,
  key: string,
) => {
  return elements.reduce((rv: any, x: any) => {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
};

export const groupedSelectOptions = (
  elements: Array<Record<string, any>>,
  key: string,
) => {
  return Object.entries(groupElementsBy(elements, key)).map((i) => ({
    label: i[0],
    options: i[1],
  }));
};
