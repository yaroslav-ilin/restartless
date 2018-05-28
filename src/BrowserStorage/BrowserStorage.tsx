import * as React from 'react';

interface IStorageItem {
  category: string;
  title: string;
  comment: string;
}

interface IStorageState {
  items: ReadonlyArray<IStorageItem>;
}

export class BrowserStorage extends React.Component<{}, IStorageState> {
  public render () {
    return <div>{this.props.children}</div>;
  }
}
