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
  'commerceUrl',
];

export const sanitizeString = (value: unknown) => {
  if (typeof value === 'string') {
    const parsed = new DOMParser().parseFromString(`<p>${value}</p>`, 'text/html');
    const textValue = parsed.body?.textContent || '';
    return textValue
      .replace(/[^a-z0-9 :/.,_-]/gim, '')
      .trim();
  }
  return value;
};

export const validateStoreDetailsKeys = (
  storeDetails: Record<string, unknown>
): StoreProps => {
  Object.keys(storeDetails).forEach((key) => {
    if (!validStoreDetailsKeys.includes(key as keyof StoreProps)) {
      // eslint-disable-next-line no-console
      console.error(`Invalid key ${key} in StoreProps`);
      // filter out invalid keys/value
      delete storeDetails[key];
    } else {
      storeDetails[key] = sanitizeString(storeDetails[key]);
    }
  });
  return storeDetails as unknown as StoreProps;
};
