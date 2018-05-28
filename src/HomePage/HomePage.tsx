import * as React from 'react';
// tslint:disable-next-line:no-duplicate-imports
import { Component, FormEventHandler } from 'react';
import { Redirect } from 'react-router-dom';

import { BrowserStorage } from '../BrowserStorage';
import { EmojiInput } from '../EmojiInput';

export class HomePage extends Component {
  public state = {
    children: null,
  };

  public render () {
    const { children } = this.state;

    return (
      <BrowserStorage>
        {children}
        <form onSubmit={this.onSubmit}>
          <EmojiInput name='category' onEmoji={this.onEmoji} placeholder='Emoji' />
        </form>
      </BrowserStorage>
    );
  }

  protected onEmoji = (emoji: string) => {
    this.setState({
      children: <Redirect push={true} to={'./category/' + emoji} />,
    });
  }

  protected onSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
  }
}
