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
import { connect } from "react-redux";
import { setActiveLevel } from "../../actions";

class NodeLevel extends React.Component {
  constructor() {
    super();
  }

  render() {
    const { node, width, index } = this.props;
    const { x, y, data } = node;
    let color = "none";
    let text = "";
    let stroke = node.data.type !== "initial" ? "#fff" : "none";
    switch (data.type) {
      case "initial":
        text = "Initial";
        break;
      case "build":
        color = "#bcdabd";
        text = "Build";
        break;
      case "apply":
        color = "#bed8ff";
        text = "Applied";
        break;
    }

    let xForRect = -x;
    let xForText = xForRect + 10;

    return (
      <g transform={`translate(${x}, ${y})`}>
        <g>
          <rect
            x={xForRect}
            y={-60}
            fill={color}
            width={width}
            height="125"
            stroke={stroke}
          />

          <text x={xForText} y={-50} fill="#777">
            <tspan x={xForText} dy={15} fontWeight="bold">
              {text}
            </tspan>
            {node.data.hunk &&
              <tspan
                x={xForText}
                dy={15}
                fontStyle="italic"
                style={styles.fileName}
                onClick={() => this.props.setActiveLevel(index)}
              >
                {node.data.hunk.fileName}
              </tspan>}
          </text>
        </g>
      </g>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setActiveLevel: function(levelIndex) {
      dispatch(setActiveLevel(levelIndex));
    }
  };
};

const styles = {
  fileName: {
    cursor: "pointer"
  }
};

export default connect(null, mapDispatchToProps)(NodeLevel);
