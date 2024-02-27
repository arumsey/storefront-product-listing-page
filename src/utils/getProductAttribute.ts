/*
Copyright 2024 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

import { Product } from '../types/interface';

const getProductAttribute = (
  product: Product | null | undefined,
  attributeName: string,
): string => {
  if (!product) {
    return '';
  }
  if (!('productView' in product)) {
    return '';
  }

  const attribute = product.productView.attributes?.find((attr) => attr.name === attributeName);
  return attribute ? attribute.value : '';
};

export { getProductAttribute };
