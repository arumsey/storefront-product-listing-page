/*
Copyright 2024 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

import { FunctionComponent } from 'preact';

import CartIcon from '../../icons/cart.svg';

export interface AddToCartButtonProps {
  onClick: (e: MouseEvent) => void;
}

export const AddToCartButton: FunctionComponent<AddToCartButtonProps> = ({
  onClick,
}: AddToCartButtonProps) => {
  return (
    <div className="ds-sdk-add-to-cart-button">
      <button
        className="flex items-center justify-center text-blue text-sm h-[32px] p-sm hover:border-gray-400"
        onClick={onClick}
        aria-label="Add to cart"
      >
        <CartIcon className="w-[20px]" />
      </button>
    </div>
  );
};
