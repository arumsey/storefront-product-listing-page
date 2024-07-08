/*
Copyright 2024 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

import { FunctionComponent } from 'preact';
import { useEffect } from 'preact/hooks';

import { useProducts } from '../../context';
import { ELLIPSIS, usePagination } from '../../hooks/usePagination';
import Chevron from '../../icons/chevron.svg';
import { JSXInternal } from "preact/src/jsx";
import TargetedMouseEvent = JSXInternal.TargetedMouseEvent;
import { getPaginationUrl } from "../../utils/handleUrlFilters";

interface PaginationProps {
  onPageChange: (page: number | string) => void;
  totalPages: number;
  currentPage: number;
}

export const Pagination: FunctionComponent<PaginationProps> = ({
  onPageChange,
  totalPages,
  currentPage,
}) => {
  const productsCtx = useProducts();
  const paginationRange = usePagination({
    currentPage,
    totalPages,
  });

  useEffect(() => {
    const { currentPage, totalPages } = productsCtx;
    if (currentPage > totalPages) {
      onPageChange(totalPages);
    }

    return () => {};
  }, []);

  const onPageClick = (event: TargetedMouseEvent<HTMLAnchorElement>, page: number | string) => {
    event.preventDefault();
    onPageChange(page)
  };

  const onPrevious = (event: TargetedMouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const onNext = (event: TargetedMouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const prevHref = getPaginationUrl(currentPage - 1);
  const nextHref = getPaginationUrl(currentPage + 1);

  return (
    <nav role="navigation" aria-label="Product list navigation">
      <ul className="ds-plp-pagination flex justify-center items-center mt-2 mb-6 list-none">
        <li>
          <a
            href={currentPage > 1 ? prevHref.toString() : undefined}
            role={currentPage > 1 ? undefined : 'button'}
            aria-label="Previous page"
            onClick={onPrevious}>
            <Chevron
              className={`h-sm w-sm transform rotate-90 ${
                currentPage === 1
                  ? 'stroke-gray-400 cursor-not-allowed'
                  : 'stroke-gray-600 cursor-pointer'
              }`}
            />
          </a>
        </li>

        {paginationRange?.map((page: number | string) => {
          if (page === ELLIPSIS) {
            return (
              <li
                key={page}
                className="ds-plp-pagination__dots text-gray-500 mx-sm my-auto"
              >
                {ELLIPSIS}
              </li>
            );
          }

          const pageHref = getPaginationUrl(page);

          return (
            <li
              key={page}
              className={`ds-plp-pagination__item flex items-center cursor-pointer text-center text-gray-500 my-auto mx-sm ${
                currentPage === page
                  ? 'ds-plp-pagination__item--current text-black font-medium underline underline-offset-4 decoration-black'
                  : ''
              }`}
            >
              <a
                href={pageHref.toString()}
                onClick={(event) => onPageClick(event, page)}
                aria-label={`Go to page ${page}`}
                aria-current={currentPage === page ? 'true' : 'false'}>
                {page}
              </a>
            </li>
          );
        })}

        <li>
          <a
            href={currentPage < totalPages ? nextHref.toString() : undefined}
            role={currentPage < totalPages ? undefined : 'button'}
            aria-label="Next page"
            onClick={onNext}>
            <Chevron
              className={`h-sm w-sm transform -rotate-90 ${
                currentPage === totalPages
                  ? 'stroke-gray-400 cursor-not-allowed'
                  : 'stroke-gray-600 cursor-pointer'
              }`}
            />
          </a>
        </li>

      </ul>
    </nav>
  );
};

export default Pagination;
