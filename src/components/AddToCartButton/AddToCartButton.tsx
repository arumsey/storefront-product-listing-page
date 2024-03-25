/*
Copyright 2024 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

import { FunctionComponent } from 'preact';

import CartIcon from '../../icons/cart.svg';
import ListIcon from '../../icons/shoppinglist.svg';

export interface AddToCartButtonProps {
  variant?: 'cart' | 'list',
  onClick: (e: MouseEvent) => void;
}

export const AddToCartButton: FunctionComponent<AddToCartButtonProps> = ({
  variant = 'cart',
  onClick,
}: AddToCartButtonProps) => {
  const Icon = variant === 'list' ? ListIcon : CartIcon;
  return (
    <div className="ds-sdk-add-to-cart-button">
      <button
        className="flex items-center justify-center text-blue text-sm h-[32px] p-sm hover:border-gray-400"
        onClick={onClick}
        aria-label={variant === 'list' ? 'Add to shopping list' : 'Add to cart'}
      >
        <Icon className="w-[20px]" />
      </button>
    </div>
  );
};
