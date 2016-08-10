import {observable, action, transaction} from 'mobx';

import {VideoInfo} from './interfaces';

export class DownloadViewState {
  // Currently inputted URL
  @observable url: string = '';

  // Video info
  @observable info: VideoInfo = null;

  // Loading message
  @observable loadingMessage: string = null;

  constructor() {}

  @action
  changeUrl(newUrl) {
    this.url = newUrl;
  }

  @action
  fetchInfo() {
    transaction(() => {
      this.info = null;
      this.loadingMessage = 'Fetching info...';
    });

    fetch("/api/info?url=" + encodeURIComponent(this.url))
      .then((response) => {
        this.loadingMessage = null;

        response.json()
          .then((json) => {
            console.log('Got response', json);
            this.info = json;
          })
      });
  }

  @action
  download(format?: string) {
    this.loadingMessage = 'Preparing download...';

    let requestUrl = "/api/download?url=" + encodeURIComponent(this.url);
    if (format) {
      requestUrl += '&format=' + format;
    }

    fetch(requestUrl)
      .then((response) => {
        this.loadingMessage = null;

        response.text()
          .then((download_url) => {
            console.log('Got response', download_url);
            window.location.assign(download_url);
          })
      });
  }
}