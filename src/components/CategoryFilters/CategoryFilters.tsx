/*
Copyright 2024 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

import { FunctionComponent } from 'preact';

import { useTranslation } from '../../context/translation';
import { Facet } from '../../types/interface';
import { Facets } from '../Facets';
import { FilterButton } from '../FilterButton';

interface CategoryFiltersProps {
  loading: boolean;
  pageLoading: boolean;
  totalCount: number;
  facets: Facet[];
  categoryName: string;
  phrase: string;
  showFilters: boolean;
  setShowFilters: (showFilters: boolean) => void;
  filterCount: number;
}

export const CategoryFilters: FunctionComponent<CategoryFiltersProps> = ({
  pageLoading,
  facets,
}) => {
  return (
    <div class="ds-widgets-_actions sm:flex relative max-w-[21rem] w-full px-2 flex-col overflow-y-auto">
      {!pageLoading && facets.length > 0 && (
        <Facets searchFacets={facets} />
      )}
    </div>
  );
};
