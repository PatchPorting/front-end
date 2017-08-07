/*  Copyright (c) 2017 IBM Corp.
Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE. */

import React from "react";
import HunkConfiguration from "./HunkConfiguration";

class HunkHeader extends React.Component {
  constructor() {
    super();
  }

  render() {
    return (
      <div className="hunk-header">
        <div className="hunk-details">
          <div
            className={`hunk-selector ${this.props.isSelected
              ? "selected"
              : ""}`}
            onClick={() => this.props.onHunkSelectToggle()}
          >
            <span>&#10004;</span>
          </div>
          <div className="info">
            <p className="filename">
              {this.props.hunk.fileName}
            </p>
            <p className="cve">
              {this.props.hunk.cve}
            </p>
            <p className="origin">
              <a href={this.props.hunk.patchUrl} target="__blank">
                {this.props.hunk.numeratedProvider}
              </a>
            </p>
          </div>
        </div>
        <HunkConfiguration hunk={this.props.hunk} />
      </div>
    );
  }
}

export default HunkHeader;
