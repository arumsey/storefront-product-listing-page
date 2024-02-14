/*
Copyright 2024 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

import { createContext, FunctionComponent } from 'preact';
import { useContext, useEffect, useState, useCallback } from 'preact/hooks';
import { getCategories } from '../api/search';
import { useStore } from './store';
import { Category } from "../types/interface";
import { isDefined } from "../utils/isDefined";

export interface CategoriesProps {
  categories: Category[];
}

const CategoriesContext = createContext<CategoriesProps>({
  categories: [],
});

const CategoriesProvider: FunctionComponent = ({ children }) => {
  const [categories, setCategories] =
    useState<CategoriesProps>({
      categories: [],
    });

  const storeCtx = useStore();

  useEffect(() => {
    const fetchData = async () => {
      const data = await getCategories({
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
    <CategoriesContext.Provider value={categoriesContext}>
      {children}
    </CategoriesContext.Provider>
  );
};

const useCategories = () => {
  const { categories } = useContext(CategoriesContext);

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
