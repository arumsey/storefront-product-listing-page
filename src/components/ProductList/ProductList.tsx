/*
Copyright 2024 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

import { FunctionComponent } from 'preact';
import { HTMLAttributes } from 'preact/compat';
import { useEffect, useState } from 'preact/hooks';

import './ProductList.css';

import { Alert } from '../Alert';
import { isGroupedProducts, useProducts, useStore } from '../../context';
import { GroupedProducts, Product } from '../../types/interface';
import { classNames } from '../../utils/dom';
import ProductItem from '../ProductItem';
import { getProductAttribute } from "../../utils/getProductAttribute";
import { SONY_PRODUCT_TYPE } from "../../utils/constants";

export interface ProductListProps extends HTMLAttributes<HTMLDivElement> {
  products: Array<Product> | GroupedProducts | null | undefined;
  showFilters: boolean;
}

export const ProductList: FunctionComponent<ProductListProps> = ({
  products,
  showFilters,
  ...otherProps
}) => {
  const {
    currencySymbol,
    currencyRate,
    setRoute,
    refineProduct,
    refreshCart,
    addToCart,
    currentPage,
    pageSize,
    totalCount,
  } = useProducts();
  const [cartUpdated, setCartUpdated] = useState(false);
  const [itemAdded, setItemAdded] = useState('');
  const { viewType } = useProducts();
  const [error, setError] = useState<boolean>(false);
  const {
    config: { listView },
  } = useStore();

  const className = showFilters
    ? 'ds-sdk-product-list bg-body max-w-full pb-2xl sm:pb-24'
    : 'ds-sdk-product-list bg-body w-full mx-auto pb-2xl sm:pb-24';

  useEffect(() => {
    refreshCart && refreshCart();
  }, [itemAdded, refreshCart]);

  // Determine group name header
  const groupNames: string[] = [];
  if (isGroupedProducts(products)) {
    groupNames.push(...Object.keys(products));
  } else {
    const [firstProduct] = products || [];
    const firstProductType = getProductAttribute(firstProduct, SONY_PRODUCT_TYPE)
    groupNames.push(firstProductType || 'Unknown product type');
  }

  return (
    <div
      {...otherProps}
      className={classNames(
        'ds-sdk-product-list bg-body pb-2xl sm:pb-24',
        className
      )}
    >
      {cartUpdated && (
        <div className="mt-8">
          <Alert
            title={`You added ${itemAdded} to your shopping cart.`}
            type="success"
            description=""
            onClick={() => setCartUpdated(false)}
          />
        </div>
      )}
      {error && (
        <div className="mt-8">
          <Alert
            title={`Something went wrong trying to add an item to your cart.`}
            type="error"
            description=""
            onClick={() => setError(false)}
          />
        </div>
      )}

      {listView && viewType === 'listview' && (
        <div className="w-full">
          {groupNames.map((groupName) => {
            const viewMoreUrl = new URL(window.location.href);
            viewMoreUrl.searchParams.set(SONY_PRODUCT_TYPE, groupName);
            let groupProducts: Product[] = [];
            let groupCount: number = 0;
            if (isGroupedProducts(products)) {
              groupProducts = products[groupName].items || [];
              groupCount = products[groupName].total_count || 0;
            } else {
              groupProducts = products || [];
              groupCount = totalCount;
            }
            const pageStart = (pageSize * (currentPage - 1)) + 1;
            const pageEnd = Math.min(pageStart + pageSize - 1, groupCount);
            return (
              <div key={groupName} className="ds-sdk-product-list__list-view-default grid grid-cols-none w-full gap-0">
                <div className="flex flex-row gap-1 items-center bg-gray-200 p-[6px] rounded-t">
                  <h2 className='inline-flex leading-loose'>{groupName}</h2>
                  {isGroupedProducts(products) ? (
                    <p className='text-xxs'>{`(${groupProducts.length} of ${groupCount})`}</p>
                  ) : (
                    <p className='text-xxs'>{`(${pageStart} to ${pageEnd} of ${groupCount})`}</p>
                  )}
                  {isGroupedProducts(products) && <a href={viewMoreUrl.toString()} className='text-xxs text-white bg-primary rounded p-[4px]'>View more&nbsp;→</a>}
                </div>
                <table className="grid-table">
                  <thead>
                    <tr>
                      <th>Description</th>
                      <th>Size</th>
                      <th>Cat. No.</th>
                      <th>Price</th>
                      <th>&nbsp;</th>
                    </tr>
                  </thead>
                  <tbody>
                    {groupProducts.map((product) => (
                      <ProductItem
                        item={product}
                        setError={setError}
                        key={product?.productView?.id}
                        currencySymbol={currencySymbol}
                        currencyRate={currencyRate}
                        setRoute={setRoute}
                        refineProduct={refineProduct}
                        setCartUpdated={setCartUpdated}
                        setItemAdded={setItemAdded}
                        addToCart={addToCart}
                      />
                    ))}
                  </tbody>
              </table>
            </div>
          )})}
        </div>
      )}
    </div>
  );
};
