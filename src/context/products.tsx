/*
Copyright 2024 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

import { createContext } from 'preact';
import { useContext, useEffect, useMemo, useState } from 'preact/hooks';

import { fetchProductSearch, refineProductSearch } from '../api/search';
import {
  Facet,
  FacetFilter, GroupedProducts,
  PageSizeOption,
  Product,
  ProductSearchQuery, ProductSearchResponse,
  RedirectRouteFunc,
} from '../types/interface';
import { WithChildrenProps } from "../types/utils";
import {
  CATEGORY_SORT_DEFAULT,
  DEFAULT_MIN_QUERY_LENGTH,
  DEFAULT_PAGE_SIZE,
  DEFAULT_PAGE_SIZE_OPTIONS,
  SEARCH_SORT_DEFAULT,
  SONY_PRODUCT_TYPE,
} from '../utils/constants';
import { moveToTop } from '../utils/dom';
import {
  getFiltersFromUrl,
  getValueFromUrl,
  handleUrlPagination,
} from '../utils/handleUrlFilters';
import { useAttributeMetadata } from './attributeMetadata';
import { useSearch } from './search';
import { useStore } from './store';
import { useTranslation } from './translation';
import { useCategories } from "./categories";
import { getProductAttribute } from "../utils/getProductAttribute";

export type ViewType = 'gridview' | 'listview' | '';

type ProductsContextType = {
  variables: ProductSearchQuery;
  loading: boolean;
  items: Product[] | GroupedProducts;
  setItems: (items: Product[] | GroupedProducts) => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  pageSize: number;
  setPageSize: (size: number) => void;
  totalCount: number;
  setTotalCount: (count: number) => void;
  totalPages: number;
  setTotalPages: (pages: number) => void;
  facets: Facet[];
  setFacets: (facets: Facet[]) => void;
  categoryName: string;
  setCategoryName: (categoryName: string) => void;
  currencySymbol: string;
  setCurrencySymbol: (currencySymbol: string) => void;
  currencyRate: string;
  setCurrencyRate: (currencyRate: string) => void;
  minQueryLength: string | number;
  minQueryLengthReached: boolean;
  setMinQueryLengthReached: (minQueryLengthReached: boolean) => void;
  pageSizeOptions: PageSizeOption[];
  setRoute: RedirectRouteFunc | undefined;
  refineProduct: (optionIds: string[], sku: string) => any;
  pageLoading: boolean;
  setPageLoading: (loading: boolean) => void;
  categoryPath: string | undefined;
  categoryId: string | undefined;
  viewType: ViewType;
  setViewType: (viewType: ViewType) => void;
  listViewType: string;
  setListViewType: (viewType: string) => void;
  resolveCartId?: () => Promise<string | undefined>;
  refreshCart?: () => void;
  addToCart?: (
    sku: string,
    options: [],
    quantity: number
  ) => Promise<void | undefined>;
  cartId?: () => Promise<string | undefined>;
}

const ProductsContext = createContext<ProductsContextType>({
  variables: {
    phrase: '',
  },
  loading: false,
  items: [],
  setItems: () => {},
  currentPage: 1,
  setCurrentPage: () => {},
  pageSize: DEFAULT_PAGE_SIZE,
  setPageSize: () => {},
  totalCount: 0,
  setTotalCount: () => {},
  totalPages: 0,
  setTotalPages: () => {},
  facets: [],
  setFacets: () => {},
  categoryName: '',
  setCategoryName: () => {},
  currencySymbol: '',
  setCurrencySymbol: () => {},
  currencyRate: '',
  setCurrencyRate: () => {},
  minQueryLength: DEFAULT_MIN_QUERY_LENGTH,
  minQueryLengthReached: false,
  setMinQueryLengthReached: () => {},
  pageSizeOptions: [],
  setRoute: undefined,
  refineProduct: () => {},
  pageLoading: false,
  setPageLoading: () => {},
  categoryPath: undefined,
  categoryId: undefined,
  viewType: '',
  setViewType: () => {},
  listViewType: '',
  setListViewType: () => {},
  resolveCartId: () => Promise.resolve(''),
  refreshCart: () => {},
  addToCart: () => Promise.resolve(),
});

const ProductsContextProvider = ({ children }: WithChildrenProps) => {
  const urlValue = getValueFromUrl('p');
  const pageDefault = urlValue ? Number(urlValue) : 1;

  const searchCtx = useSearch();
  const { config: storeConfig, ...storeCtx} = useStore();
  const attributeMetadataCtx = useAttributeMetadata();
  const { findCategoryByPath, buildCategoryList } = useCategories();

  const pageSizeValue = getValueFromUrl('page_size');
  const defaultPageSizeOption =
    Number(storeConfig?.perPageConfig?.defaultPageSizeOption) ||
    DEFAULT_PAGE_SIZE;
  const pageSizeDefault = pageSizeValue
    ? Number(pageSizeValue)
    : defaultPageSizeOption;

  const translation = useTranslation();

  const showAllLabel = translation.ProductContainers.showAll;

  const [loading, setLoading] = useState(true);
  const [pageLoading, setPageLoading] = useState(true);
  const [items, setItems] = useState<Product[] | GroupedProducts>([]);
  const [currentPage, setCurrentPage] = useState<number>(pageDefault);
  const [pageSize, setPageSize] = useState<number>(pageSizeDefault);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [facets, setFacets] = useState<Facet[]>([]);
  const [categoryName, setCategoryName] = useState<string>(
    storeConfig?.categoryName ?? ''
  );
  const [pageSizeOptions, setPageSizeOptions] = useState<PageSizeOption[]>([]);
  const [currencySymbol, setCurrencySymbol] = useState<string>(
    storeConfig?.currencySymbol ?? ''
  );
  const [currencyRate, setCurrencyRate] = useState<string>(
    storeConfig?.currencyRate ?? ''
  );
  const [minQueryLengthReached, setMinQueryLengthReached] =
    useState<boolean>(false);
  const minQueryLength = useMemo(() => {
    return storeConfig?.minQueryLength || DEFAULT_MIN_QUERY_LENGTH;
  }, [storeConfig.minQueryLength]);

  const categoryPath = storeConfig?.currentCategoryUrlPath;
  let categoryUrlList: string[] = categoryPath ? [categoryPath] : [];
  if (typeof categoryPath === 'string') {
    const startCategory = findCategoryByPath(categoryPath);
    if (startCategory) {
      categoryUrlList = buildCategoryList(startCategory.id).map((cat) => cat.urlPath);
    }
  }
  const categoryId = storeConfig?.currentCategoryId;

  const [viewType, setViewType] = useState<ViewType>('listview');
  const [listViewType, setListViewType] = useState<string>('default');

  const variables = useMemo(() => {
    return {
      phrase: searchCtx.phrase,
      filter: searchCtx.filters,
      sort: searchCtx.sort,
      context: storeCtx.context,
      pageSize,
      displayOutOfStock: storeConfig?.displayOutOfStock,
      currentPage,
    };
  }, [
    searchCtx.phrase,
    searchCtx.filters,
    searchCtx.sort,
    storeCtx.context,
    storeConfig.displayOutOfStock,
    pageSize,
    currentPage,
  ]);

  const handleRefineProductSearch = async (
    optionIds: string[],
    sku: string
  ) => {
    return  await refineProductSearch({ ...storeCtx, optionIds, sku });
  };

  const searchProducts = async () => {
    if (!checkMinQueryLength()) {
      setLoading(false);
      setPageLoading(false);
      return;
    }

    try {
      setLoading(true);
      moveToTop();

      const categoryFilters = getCategorySearchFilters(categoryUrlList, categoryId);
      const filters = [...variables.filter, ...categoryFilters];

      if (categoryUrlList.length === 1) {
        //add default category sort
        if (variables.sort.length < 1 || variables.sort === SEARCH_SORT_DEFAULT) {
          variables.sort = CATEGORY_SORT_DEFAULT;
        }
      }

      const data = await fetchProductSearch({
        ...variables,
        ...storeCtx,
        apiUrl: storeCtx.apiUrl,
        filter: filters,
        categorySearch: !!categoryPath || !!categoryId,
      });

      const { groupConfig = { groupBy: '', size: 3, ignore: []} } = storeConfig;
      const shouldUseGrouping = !variables.phrase
        && filters.every((facet) => facet.attribute !== groupConfig.groupBy);
      const groupByFacet = groupConfig.groupBy
        ? (data?.productSearch.facets || []).find((facet) => facet.attribute === groupConfig.groupBy)
        : undefined;
      const groupByBuckets = groupByFacet?.buckets || [];
      const searchRequests: Array<ReturnType<typeof fetchProductSearch>> = [];

      if (shouldUseGrouping && groupByFacet) {
        // build an array of requests for every grouping filter
        groupByBuckets.forEach((bucketItem) => {
          if (!groupConfig.ignore.includes(bucketItem.title)) {
            variables.pageSize = groupConfig.size;
            searchRequests.push(fetchProductSearch({
              ...variables,
              ...storeCtx,
              apiUrl: storeCtx.apiUrl,
              filter: [...filters, {
                attribute: groupByFacet.attribute,
                eq: bucketItem.title,
              }],
              categorySearch: !!categoryPath,
            }));
          }
        })
      }

      const groupData = await Promise.allSettled(searchRequests);
      const fulfilledData = groupData
        .filter((result): result is PromiseFulfilledResult<ProductSearchResponse['data']> => result.status === 'fulfilled')
        .map((fulfilled) => fulfilled.value)

      if (fulfilledData.length > 0) {
        const groupedProducts = fulfilledData.reduce<GroupedProducts>((groups, data) => {
          const groupProducts = data?.productSearch?.items || [];
          const [sampleProduct] = groupProducts;
          if (sampleProduct) {
            const groupName = getProductAttribute(sampleProduct, groupConfig.groupBy)
            groups[groupName] = {
              total_count: data?.productSearch?.total_count || 0,
              items: groupProducts,
            };
          }
          return groups;
        }, {});
        setItems(groupedProducts);
      } else {
        setItems(data?.productSearch?.items || []);
      }

      setFacets(data?.productSearch?.facets || []);
      setTotalCount(data?.productSearch?.total_count || 0);
      setTotalPages(data?.productSearch?.page_info?.total_pages || 1);
      handleCategoryNames(data?.productSearch?.facets || []);

      getPageSizeOptions(data?.productSearch?.total_count);

      paginationCheck(
        data?.productSearch?.total_count,
        data?.productSearch?.page_info?.total_pages
      );

    } finally {
      setLoading(false);
      setPageLoading(false);
    }
  };

  const checkMinQueryLength = () => {
    if (
      !storeConfig?.currentCategoryUrlPath &&
      !storeConfig?.currentCategoryId &&
      searchCtx.phrase.trim().length <
        (Number(storeConfig?.minQueryLength) || DEFAULT_MIN_QUERY_LENGTH)
    ) {
      setItems([]);
      setFacets([]);
      setTotalCount(0);
      setTotalPages(1);
      setMinQueryLengthReached(false);
      return false;
    }
    setMinQueryLengthReached(true);
    return true;
  };

  const getPageSizeOptions = (totalCount: number | null) => {
    const optionsArray: PageSizeOption[] = [];
    const pageSizeString =
      storeConfig?.perPageConfig?.pageSizeOptions ||
      DEFAULT_PAGE_SIZE_OPTIONS;
    const pageSizeArray = pageSizeString.split(',');
    pageSizeArray.forEach((option) => {
      optionsArray.push({
        label: option,
        value: parseInt(option, 10),
      });
    });

    if (storeConfig?.allowAllProducts == '1') {
      // '==' is intentional for conversion
      optionsArray.push({
        label: showAllLabel,
        value: totalCount !== null ? (totalCount > 500 ? 500 : totalCount) : 0,
      });
    }
    setPageSizeOptions(optionsArray);
  };

  const paginationCheck = (
    totalCount: number | null,
    totalPages: number | undefined
  ) => {
    if (totalCount && totalCount > 0 && totalPages === 1) {
      setCurrentPage(1);
      handleUrlPagination(1);
    }
  };

  const getCategorySearchFilters = (
    categoryPath?: string[],
    categoryId?: string,
    ): FacetFilter[] => {
    const filters: FacetFilter[] = [];
    if ((!categoryPath || !categoryPath.length) && !categoryId) {
      return filters;
    }
    //add category filters
    if (categoryPath && categoryPath.length) {
      if (categoryPath.length === 1) {
        filters.push({
          attribute: 'categoryPath',
          eq: categoryPath[0],
        });
      } else {
        filters.push({
          attribute: 'categoryPath',
          in: categoryPath,
        });
      }
    }
    if (categoryId) {
      const categoryIdFilter = {
        attribute: 'categoryIds',
        eq: categoryId,
      };
      filters.push(categoryIdFilter);
    }

    return filters;

  };

  const handleCategoryNames = (facets: Facet[]) => {
    facets.map((facet) => {
      const bucketType = facet?.buckets[0]?.__typename;
      if (bucketType === 'CategoryView') {
        const names = facet.buckets.map((bucket) => {
          if (bucket.__typename === 'CategoryView')
            return {
              name: bucket.name,
              value: bucket.title,
              attribute: facet.attribute,
            };
        });
        searchCtx.setCategoryNames(names);
      }
    });
  };

  useEffect(() => {
    if (attributeMetadataCtx.filterableInSearch) {
      searchProducts();
    }
  }, [searchCtx.filters]);

  useEffect(() => {
    if (attributeMetadataCtx.filterableInSearch) {
      const filtersFromUrl = getFiltersFromUrl(
        [...attributeMetadataCtx.filterableInSearch, SONY_PRODUCT_TYPE]
      );
      searchCtx.setFilters(filtersFromUrl);
    }
  }, [attributeMetadataCtx.filterableInSearch]);

  useEffect(() => {
    if (!loading) {
      searchProducts();
    }
  }, [searchCtx.phrase, searchCtx.sort, currentPage, pageSize]);

  const productContext: ProductsContextType= {
    variables,
    loading,
    items,
    setItems,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    totalCount,
    setTotalCount,
    totalPages,
    setTotalPages,
    facets,
    setFacets,
    categoryName,
    setCategoryName,
    currencySymbol,
    setCurrencySymbol,
    currencyRate,
    setCurrencyRate,
    minQueryLength,
    minQueryLengthReached,
    setMinQueryLengthReached,
    pageSizeOptions,
    setRoute: storeConfig?.route,
    refineProduct: handleRefineProductSearch,
    pageLoading,
    setPageLoading,
    categoryPath,
    categoryId,
    viewType,
    setViewType,
    listViewType,
    setListViewType,
    cartId: storeConfig.resolveCartId,
    refreshCart: storeConfig.refreshCart,
    resolveCartId: storeConfig.resolveCartId,
    addToCart: storeConfig.addToCart,
  };

  return (
    <ProductsContext.Provider value={productContext}>
      {children}
    </ProductsContext.Provider>
  );
};

const isGroupedProducts = (value?: Product[] | GroupedProducts | null): value is GroupedProducts => {
  return !Array.isArray(value);
}

const useProducts = () => {
  return useContext(ProductsContext);
};

export { ProductsContextProvider, useProducts, isGroupedProducts };
