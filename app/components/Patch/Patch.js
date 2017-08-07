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
import { ExpandableCodeBlock } from "../common/Code";

class Patch extends React.Component {
  constructor() {
    super();
  }

  render() {
    const { patch, index } = this.props;
    let patchLines = patch.patch ? patch.patch.split("\n") : [];
    let href = `data:text/plain;charset=utf-8,${encodeURIComponent(
      patch.patch
    )}`;
    return (
      <div className="patch">
        <div className="patch-header">
          <div className="patch-name">
            {`Patch ${index + 1}`}
          </div>
          <div className="patch-download">
            <a
              className="btn download"
              href={href}
              download={`patch${index + 1}.patch`}
            >
              Download
            </a>
          </div>
        </div>
        <div className="patch-body">
          <ExpandableCodeBlock linesOfCode={patchLines} />
        </div>
      </div>
    );
  }
}

export default Patch;
