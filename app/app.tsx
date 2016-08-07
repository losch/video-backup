import * as React from 'react';
import {Component} from 'react';
import * as ReactDOM from 'react-dom';
import {Router, Route, browserHistory} from 'react-router';

import DownloadView, { DownloadViewState } from './Download';

let appState = {
  downloadView: new DownloadViewState()
};

class DownloadViewWrapper extends Component<{children: any, params: any}, {}> {
  render() {
    return <DownloadView appState={appState.downloadView} />;
  }
}

ReactDOM.render(
  <Router history={browserHistory}>
    <Route path='/' component={DownloadViewWrapper}>
    </Route>
  </Router>,
  document.getElementById('root')
);
