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

const CategoriesProvider: FunctionComponent = ({ children }) => {
  const [categories, setCategories] =
    useState<CategoriesContext>({
      categories: [],
    });

  const storeCtx = useStore();

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
        setCategories({ categories: data.categories })
      }
    };

    fetchData();
  }, []);

  const categoriesContext = {
    ...categories,
  };

  return (
    <Provider value={categoriesContext}>
      {children}
    </Provider>
  );
};

const useCategories = () => {
  const { categories } = useContext(categoriesContext);

  const findCategory = useCallback((id: string) => {
    return categories.find((cat) => cat.id === id);
  }, [categories]);

  const findCategoryByPath = useCallback((path: string) => {
    return categories.find((cat) => cat.urlPath === path);
  }, [categories]);

  const buildCategoryList = useCallback((start: string) => {
    const startCategory = findCategory(start);
    if (!startCategory) {
      return [];
    }
    const childCategories: Category[] = startCategory.children
      .flatMap((childId) => findCategory(childId))
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
