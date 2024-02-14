/*
Copyright 2024 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

export function isDefined<T>(val: T | undefined | null): val is T {
  return val !== undefined && val !== null;
}