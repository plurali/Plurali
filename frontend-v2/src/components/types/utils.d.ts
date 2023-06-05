import { ComponentPropsWithRef, ElementType, PropsWithChildren } from 'react';

export type PolymorphicProps<C extends ElementType = ElementType, P extends object = object> = { as?: C } & P &
  PropsWithChildren &
  ComponentPropsWithRef<C>;

export interface WithClassName {
  className?: string;
}

export interface ModelProps<V> {
  value: V;
  setValue: (value: V) => unknown;
}
