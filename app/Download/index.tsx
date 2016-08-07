import * as React from 'react';
import {Component} from 'react';
import {observable, action} from 'mobx';
import {observer} from 'mobx-react';
require('es6-promise').polyfill();
require('isomorphic-fetch');
import * as filesize from 'filesize';

export class DownloadViewState {
  @observable url = '';
  @observable info = null;
  @observable loadingMessage = null;

  constructor() {}

  @action
  changeUrl(newUrl) {
    this.url = newUrl;
  }

  @action
  fetchInfo() {
    this.info = null;
    this.loadingMessage = 'Fetching info...';

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

class VideoFormats extends Component<{formats: any, download: any}, {}> {
  download(e, format) {
    e.preventDefault();
    this.props.download(format);
  }

  render() {
    return (
      <div>
        <a href="#moreformats"
           className="videoformats--accordion-toggle accordion-toggle collapsed"
           data-toggle="collapse"
           aria-expanded="false"
           aria-controls="moreformats">See other formats</a>

        <div id="moreformats" className="collapse">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Format</th>
                <th>Extension</th>
                <th>Video codec</th>
                <th>Audio codec</th>
                <th>Filesize</th>
                <th />
              </tr>
            </thead>
            <tbody>
            {
              this.props.formats.map((format, i) =>
                <tr key={'format-' + i}>
                  <td>{format.format}</td>
                  <td>{format.ext}</td>
                  <td>{format.vcodec}</td>
                  <td>{format.acodec}</td>
                  <td>{isNaN(format.filesize) ?
                         '' :
                         filesize(format.filesize)}</td>
                  <td><a href="#"
                         className="btn btn-primary"
                         onClick={(e) =>
                          this.download(e, format.format_id)}>Download</a></td>
                </tr>
              )
            }
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

@observer
class DownloadView extends Component<{appState: DownloadViewState}, {}> {
  submit(e) {
    e.preventDefault();
    this.props.appState.fetchInfo();
  }

  onChange(e) {
    this.props.appState.changeUrl(e.target.value);
  }

  download(e) {
    e.preventDefault();
    this.props.appState.download();
  }

  render() {
    const { info, loadingMessage } = this.props.appState;

    return (
      <div className="container">
        <div className="row">
          <h1>Video backup</h1>
          <div className="col-xs-12">
            <form onSubmit={(e) => this.submit(e)}>
              <div className="form-group">
                <label>Url:</label>
                <input type="text"
                       className="form-control"
                       placeholder="Url"
                       name="url"
                       onChange={(e) => this.onChange(e)}
                       value={this.props.appState.url} />
              </div>
              {
                this.props.appState.loadingMessage ?
                  <button type="submit"
                          className="btn btn-default"
                          disabled>Submit</button> :
                  <button type="submit"
                          className="btn btn-default">Submit</button>
              }
            </form>
          </div>
        </div>
        {
          loadingMessage ?
            <div>
              <div className="sk-cube-grid">
                <div className="sk-cube sk-cube1"></div>
                <div className="sk-cube sk-cube2"></div>
                <div className="sk-cube sk-cube3"></div>
                <div className="sk-cube sk-cube4"></div>
                <div className="sk-cube sk-cube5"></div>
                <div className="sk-cube sk-cube6"></div>
                <div className="sk-cube sk-cube7"></div>
                <div className="sk-cube sk-cube8"></div>
                <div className="sk-cube sk-cube9"></div>
              </div>
              <div className="sk-cube-text">{loadingMessage}</div>
            </div> :
            null
        }
        {
          !loadingMessage && info ?
            <div className="row">
              <div className="col-xs-12">
                <h4>{ info.title }</h4>

                <p><b>Description:</b> {info.description}</p>
                <p><b>Original URL:</b> <a
                  target="_blank"
                  href={info.webpage_url}>{info.webpage_url}</a></p>
                <a href="#"
                   onClick={(e) => this.download(e) }
                   className="btn btn-primary">Download (best quality)</a>
                <VideoFormats formats={info.formats}
                              download={(format) =>
                                this.props.appState.download(format)} />
              </div>
            </div> :
            null
        }
      </div>
    );
  }
}

export default DownloadView;
