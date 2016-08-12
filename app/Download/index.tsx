import * as React from 'react';
import {Component} from 'react';
import {observer} from 'mobx-react';
import * as ClassNames from 'classnames';

import { DownloadViewState } from './state';
import VideoFormats from './VideoFormats';

export * from './state';

@observer
export class DownloadView extends Component<{appState: DownloadViewState},
                                            {isMoreCollapsed: boolean}> {
  constructor(props) {
    super(props);
    this.state = {
      isMoreCollapsed: true
    };
  }

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

  toggleMoreFormats(e) {
    this.setState({isMoreCollapsed: !this.state.isMoreCollapsed});
    e.preventDefault();
  }

  createThumbnailUrl(maxres) {
    return maxres.replace('maxresdefault.jpg',
                          'hqdefault.jpg?custom=true&w=196&h=110');
  }

  /*
   * Formats duration from seconds to HH:mm:ss
   */
  formatDuration(duration: number): String {
    var hours   = Math.floor(duration / 3600);
    var minutes = Math.floor((duration - (hours * 3600)) / 60);
    var seconds = duration - (hours * 3600) - (minutes * 60);

    if (hours < 10) { hours   = "0" + hours; }
    if (minutes < 10) { minutes = "0" + minutes; }
    if (seconds < 10) { seconds = "0" + seconds; }

    return hours + ':' + minutes + ':' + seconds;
  }

  render() {
    const { info, loadingMessage } = this.props.appState;

    let moreButtonClassNames = ClassNames(
      'download-view--button button is-link accordion-toggle',
      { 'collapsed': this.state.isMoreCollapsed }
    );

    return (
      <div>
        <header className="header">
          <div className="container">
            <h1 className="title">Video backup</h1>
          </div>
        </header>
        <section className="section">
          <div className="container">
            <div className="content">
              <form onSubmit={(e) => this.submit(e)}>
                <label className="label">Url:</label>
                <p className="control">
                  <input type="text"
                         className="input"
                         placeholder="Url"
                         name="url"
                         onChange={(e) => this.onChange(e)}
                         value={this.props.appState.url} />
                </p>
                <p className="control">
                  {
                    loadingMessage ?
                      <button type="submit"
                              className="button is-primary"
                              disabled>Fetch info</button> :
                      <button type="submit"
                              className="button is-primary">Fetch info</button>
                  }
                </p>
              </form>
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
                <div className="content">
                  <div className="box">
                    <div className="columns">
                      <div className="column is-one-third">
                        <img src={ this.createThumbnailUrl(info.thumbnail) } />
                      </div>
                      <div className="column">
                        <h2>{ info.title }</h2>
                        <h4>{ this.formatDuration(info.duration) }</h4>
                        <p><b>Description:</b> {info.description}</p>
                        <p><b>Original URL:</b> <a
                          target="_blank"
                          href={info.webpage_url}>{info.webpage_url}</a></p>
                      </div>
                    </div>
                    <p className="control">
                      <button
                         onClick={(e) => this.download(e) }
                         className="download-view--button button is-primary">
                          Download (best quality)</button>
                      <button className={moreButtonClassNames}
                              onClick={(e) => this.toggleMoreFormats(e)}
                        >Other formats...</button>
                    </p>
                    <VideoFormats isCollapsed={this.state.isMoreCollapsed}
                                  formats={info.formats}
                                  download={(format) =>
                                    this.props.appState.download(format)} />
                  </div>
                </div> :
                null
            }
          </div>
        </section>
      </div>
    );
  }
}
