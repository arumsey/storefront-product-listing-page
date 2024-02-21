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
import { useProducts, useStore } from '../../context';
import { Product } from '../../types/interface';
import { classNames } from '../../utils/dom';
import ProductItem from '../ProductItem';

export interface ProductListProps extends HTMLAttributes<HTMLDivElement> {
  products: Array<Product> | null | undefined;
  numberOfColumns: number;
  showFilters: boolean;
}

const typeNames = [
  'Antibodies Single',
  'Secondary Antibody',
  '2nd Step (non-Ab)',
];

export const ProductList: FunctionComponent<ProductListProps> = ({
  products,
  numberOfColumns,
  showFilters,
}) => {
  const productsCtx = useProducts();
  const {
    currencySymbol,
    currencyRate,
    setRoute,
    refineProduct,
    refreshCart,
    addToCart,
    totalCount,
  } = productsCtx;
  const [cartUpdated, setCartUpdated] = useState(false);
  const [itemAdded, setItemAdded] = useState('');
  const { viewType } = useProducts();
  const [error, setError] = useState<boolean>(false);
  const {
    config: { listView },
  } = useStore();

  const className = showFilters
    ? 'ds-sdk-product-list bg-body max-w-full pl-3 pb-2xl sm:pb-24'
    : 'ds-sdk-product-list bg-body w-full mx-auto pb-2xl sm:pb-24';

  useEffect(() => {
    refreshCart && refreshCart();
  }, [itemAdded, refreshCart]);

  return (
    <div
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
          {typeNames.map((productType) => {
            const typeId = '16146';
            const viewMoreUrl = new URL(window.location.href);
            viewMoreUrl.searchParams.set('sonybt_product_type', typeId);
            return (
              <div key={productType} className="ds-sdk-product-list__list-view-default mt-md grid grid-cols-none pt-[15px] w-full gap-[10px]">
                <div className="flex flex-row gap-1 items-center bg-gray-200 p-[6px]">
                  <h2 className='inline-flex'>{productType}</h2>
                  <p className='text-xxs'>{`(3 of ${totalCount})`}</p>
                  <a href={viewMoreUrl.toString()} className='text-xxs text-white bg-primary rounded p-[4px]'>View more&nbsp;→</a>
                </div>
                <div className="grid-container">
                  <span className="grid-header">Description</span>
                  <span className="grid-header invisible">Name</span>
                  <span className="grid-header">Size</span>
                  <span className="grid-header">Cat. No.</span>
                  <span className="grid-header">Price</span>
                  <span className="grid-header invisible">Add to cart</span>
                {products?.slice(0, 3).map((product) => (
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
              </div>
            </div>
          )})}
        </div>
      )}
      {viewType !== 'listview' && (
        <div
          style={{
            gridTemplateColumns: `repeat(${numberOfColumns}, minmax(0, 1fr))`,
          }}
          className="ds-sdk-product-list__grid mt-md grid gap-y-8 gap-x-2xl xl:gap-x-8"
        >
          {products?.map((product) => (
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
        </div>
      )}
    </div>
  );
};
