import * as React from 'react';
// tslint:disable-next-line:no-duplicate-imports
import { Component, FormEventHandler } from 'react';
import { RouteComponentProps } from 'react-router-dom';

export interface IMatchParams {
  category: string;
}

export function CategoryPage (props: RouteComponentProps<IMatchParams>) {
  const { match } = props;
  const { params } = match;
  const { category } = params;

  return (
    <main>
      <p>{category}</p>
      <form>
        <input name='comment' />
      </form>
    </main>
  );
}
