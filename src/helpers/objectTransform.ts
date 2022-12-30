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
