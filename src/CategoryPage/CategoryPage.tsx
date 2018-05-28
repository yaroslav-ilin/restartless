import * as React from 'react';
// tslint:disable-next-line:no-duplicate-imports
import { Component, FormEventHandler } from 'react';
import { RouteComponentProps } from 'react-router-dom';

export interface IMatchParams {
  category: string;
}

export class CategoryPage extends Component<RouteComponentProps<IMatchParams>> {
  public render () {
    const { match } = this.props;
    const { params } = match;
    const { category } = params;

    const items = [
      { comment: 'barbershop' },
    ];

    return (
      <main>
        <h1>Category: <span>{category}</span></h1>

        <form onSubmit={this.onCommentSubmit}>
          <h2>Create New Activity</h2>
          <input name='comment' placeholder='Details' />
          <input type='submit' value='Add Activity' />
        </form>

        <div>
          <h2>Latest Activities in The Category</h2>
          <ul>
            {items.map((item, id) => <li key={id}>{item.comment}</li>)}
          </ul>
        </div>
      </main>
    );
  }

  protected onCommentSubmit: FormEventHandler<HTMLFormElement> = (evt) => {
    evt.preventDefault();
    console.log(evt.currentTarget.comment.value);
  }
}
