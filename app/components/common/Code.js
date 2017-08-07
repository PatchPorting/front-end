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

export const Code = ({ linesOfCode, offset }) =>
  <div className="code-block" style={{ marginTop: -offset }}>
    {linesOfCode.map((line, key) => {
      let operator = line.charAt(0);
      let secondChar = line.charAt(1);
      let highlitable = secondChar !== operator ? true : false;

      if (operator === "+" && highlitable) {
        return (
          <pre key={key} className="added-line">
            {line}
          </pre>
        );
      } else if (operator === "-" && highlitable) {
        return (
          <pre key={key} className="removed-line">
            {line}
          </pre>
        );
      } else {
        return (
          <pre key={key}>
            {line}
          </pre>
        );
      }
    })}
  </div>;

export class ExpandableCodeBlock extends React.Component {
  constructor() {
    super();
    this.state = {
      expanded: false
    };
  }

  toggleExpansion() {
    this.setState({
      expanded: !this.state.expanded
    });
  }

  render() {
    const { linesOfCode } = this.props;
    let dataHeight = linesOfCode.length * 30;
    let dataCenter = !this.state.expanded ? linesOfCode.length * 9 / 2 : 0;

    return (
      <div
        className={`expandable-code-container ${this.state.expanded
          ? "expanded"
          : ""}`}
        style={this.state.expanded ? { maxHeight: dataHeight } : {}}
        onClick={() => this.toggleExpansion()}
      >
        <div className="expandable-code-overlay" />
        <Code linesOfCode={linesOfCode} offset={dataCenter} />
      </div>
    );
  }
}
