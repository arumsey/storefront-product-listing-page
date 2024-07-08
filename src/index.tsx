/*
Copyright 2024 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

import { render } from 'preact';

import './styles/index.css';

import App from './containers/App';
import {
  AttributeMetadataProvider,
  CartProvider,
  CategoriesProvider,
  ProductsContextProvider,
  SearchProvider,
  StoreContextProvider,
  StoreProps,
} from './context/';
import Resize from './context/displayChange';
import Translation from './context/translation';
import { StoreDetailsConfig } from "./types/interface";
import { getUserViewHistory } from './utils/getUserViewHistory';
import { validateStoreDetailsKeys } from './utils/validateStoreDetails';

type OptionalHeaderViews = Omit<StoreDetailsConfig, 'headerViews'> & Pick<Partial<StoreDetailsConfig>, 'headerViews'>;

type UnsafeStoreConfig = Omit<StoreProps, 'config'> & { config: OptionalHeaderViews } & Record<string, unknown>;

type MountSearchPlpProps = {
  storeDetails: UnsafeStoreConfig;
  root: HTMLElement;
};

const LiveSearchPLP = ({ storeDetails, root }: MountSearchPlpProps) => {
  if (!storeDetails) {
    throw new Error("LiveSearch PLP's storeDetails prop was not provided");
  }
  if (!root) {
    throw new Error("LiveSearch PLP's root prop was not provided");
  }

  const userViewHistory = getUserViewHistory();

  const updatedStoreDetails: UnsafeStoreConfig = {
    ...storeDetails,
    config: {
      headerViews: ['search', 'sort'],
      ...storeDetails.config,
    },
    context: {
      ...storeDetails.context,
      userViewHistory,
    },
  };

  render(
    <StoreContextProvider {...validateStoreDetailsKeys(updatedStoreDetails)}>
      <AttributeMetadataProvider>
        <CategoriesProvider>
          <SearchProvider>
            <Resize>
              <Translation>
                <ProductsContextProvider>
                  <CartProvider>
                    <App />
                  </CartProvider>
                </ProductsContextProvider>
              </Translation>
            </Resize>
          </SearchProvider>
        </CategoriesProvider>
      </AttributeMetadataProvider>
    </StoreContextProvider>,
    root
  );
};

if (typeof window !== 'undefined' && !window.LiveSearchPLP) {
  window.LiveSearchPLP = LiveSearchPLP;
}
