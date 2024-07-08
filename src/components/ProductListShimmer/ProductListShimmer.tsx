/*
Copyright 2024 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

import { FunctionComponent } from 'preact';

import './ProductListShimmer.css';

type Props = {
  items: string[],
};

export const ProductListShimmer: FunctionComponent<Props> = ({ items }) => {
  return (
    <div className="ds-sdk-product-list ds-sdk-product-list--shimmer">
      {items.map((_, index) => (<div key={index} className="ds-sdk-product-list__item shimmer-animation-list" />))}
    </div>
  );
};

export default ProductListShimmer;
