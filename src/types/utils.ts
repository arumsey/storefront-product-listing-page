/**
 * Utility Types
 */
import { ComponentChildren } from "preact";

export type OptionalArray<T> = T | Array<T>;

export interface WithChildrenProps {
  children?: ComponentChildren;
}