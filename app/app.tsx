import * as React from 'react';
import {Component} from 'react';
import * as ReactDOM from 'react-dom';
import {observable} from 'mobx';
import {observer} from 'mobx-react';
import DevTools from 'mobx-react-devtools';
import {Router, Route, IndexRoute, browserHistory} from 'react-router';

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
      { /*
      <IndexRoute component={Empty} />
      <Route path='search/:query' component={ContactDetailsWrapper} />
      <Route path='new' component={NewContactWrapper} />
      <Route path=':contactId' component={ContactDetailsWrapper} />
      <Route path=':contactId/edit' component={EditContactWrapper} />
      */ }
    </Route>
  </Router>,
  document.getElementById('root')
);
