import { StoreProps } from '../context';

const validStoreDetailsKeys: Array<keyof StoreProps> = [
  'environmentId',
  'environmentType',
  'websiteCode',
  'storeCode',
  'storeViewCode',
  'config',
  'context',
  'apiUrl',
  'apiKey',
  'route',
  'searchQuery',
];

export const sanitizeString = (value: any) => {
  // just incase, https://stackoverflow.com/a/23453651
  if (typeof value === 'string') {
    // eslint-disable-next-line no-useless-escape
    value = value.replace(/[^a-z0-9áéíóúñü \.,_-]/gim, '');
    return value.trim();
  }
  return value;
};

export const validateStoreDetailsKeys = (
  storeDetails: StoreProps
): StoreProps => {
  Object.keys(storeDetails).forEach((key: string) => {
    if (!validStoreDetailsKeys.includes(key as keyof StoreProps)) {
      // eslint-disable-next-line no-console
      console.error(`Invalid key ${key} in StoreProps`);
      // filter out invalid keys/value
      delete (storeDetails as any)[key];
      return;
    }
    (storeDetails as any)[key] = sanitizeString((storeDetails as any)[key]);
  });
  return storeDetails;
};
