/*
Copyright 2024 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

import { createContext, FunctionComponent } from 'preact';
import { useCallback,useContext, useEffect, useState } from 'preact/hooks';

import { fetchCategories } from '../api/search';
import { Category } from "../types/interface";
import { isDefined } from "../utils/isDefined";
import { useStore } from './store';

interface CategoriesContext {
  categories: Category[];
}

const categoriesContext = createContext<CategoriesContext>({
  categories: [],
});

const { Provider } = categoriesContext;

const getCategory = (urlPath: string, categories: Category[]) => {
  return categories.find((cat) => cat.urlPath === urlPath);
};

const CategoriesProvider: FunctionComponent = ({ children }) => {
  const [categories, setCategories] = useState<Category[]>([]);

  const { config: storeConfig, ...storeCtx } = useStore();

  useEffect(() => {
    if (storeConfig.onCategoryChange && storeConfig.currentCategoryUrlPath) {
      const selectedCategory = getCategory(storeConfig.currentCategoryUrlPath, categories);
      if (selectedCategory) {
        storeConfig.onCategoryChange(selectedCategory);
      }
    }
  }, [categories]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchCategories({
        ...storeCtx,
        apiUrl: storeCtx.apiUrl,
        ids: ['3'],
        roles: ['active'],
        subtree: { depth: 4, startLevel: 1 },
      });
      if (data?.categories) {
        setCategories(data.categories)
      }
    };

    fetchData();
  }, []);

  const categoriesContext = {
    categories,
  };

  return (
    <Provider value={categoriesContext}>
      {children}
    </Provider>
  );
};

const useCategories = () => {
  const { categories } = useContext(categoriesContext);

  const findCategory = useCallback((id: string): Category | undefined => {
    return categories.find((cat) => cat.id === id);
  }, [categories]);

  const findCategoryByPath = useCallback((path: string) => {
    return categories.find((cat) => cat.urlPath === path);
  }, [categories]);

  const buildCategoryList = useCallback((start: string): Category[] => {
    const startCategory = findCategory(start);
    if (!startCategory) {
      return [];
    }

    const flattenCategories = (ids: string[]): Array<Category | undefined> => ids.flatMap((catId) => {
      const cat = findCategory(catId);
      return [cat, ...flattenCategories(cat?.children || [])];
    });

    const childCategories: Category[] = flattenCategories(startCategory.children)
      .filter((cat): cat is Category => isDefined<Category>(cat));
    return [startCategory, ...childCategories];
  }, [findCategory]);

  return {
    categories,
    findCategory,
    findCategoryByPath,
    buildCategoryList,
  }
};

export { CategoriesProvider, useCategories };
