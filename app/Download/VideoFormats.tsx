/*
 * Component for displaying available video formats
 */

import * as React from 'react';
import {Component} from 'react';
import * as filesize from 'filesize';

import {VideoFormat} from './interfaces';

export interface VideoFormatsProps {
  // Available formats
  formats: Array<VideoFormat>,

  // Function that is called when download button is clicked
  download: (format: string) => void,

  // Is the component in collapsed state?
  isCollapsed: boolean
}

export default class VideoFormats extends Component<VideoFormatsProps, {}> {
  download(e, format) {
    e.preventDefault();
    this.props.download(format);
  }

  render() {
    return (
      <div style={{display: this.props.isCollapsed ? 'none' : 'block'}}>
        <div>
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
                         className="button is-primary"
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

