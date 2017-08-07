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

import React, { Component } from "react";
import { NumInput, FormGroup, Label } from "../Form";
import NumberSelect from "../Form/Select/NumberSelect";

class Heuristic extends Component {
  constructor() {
    super();
  }

  getHeuristic(heuristic) {
    switch (heuristic.heuristic) {
      case "Classical":
      case "Offset":
      case "IgnoreFilename":
        return <BasicHeuristic heuristic={heuristic} />;
        break;

      case "Fuzz":
      case "FuzzIgnoreFilename":
        return (
          <ExtendedHeuristic
            heuristic={heuristic}
            onUpdate={this.props.onUpdate}
          />
        );
        break;
    }
  }

  render() {
    return (
      <div>
        <div style={styles.container}>
          <div style={styles.leftSide}>
            {this.getHeuristic(this.props.heuristic)}
          </div>

          <span style={styles.delete} onClick={this.props.onRemove}>
            &#10005;
          </span>
        </div>
      </div>
    );
  }
}

export default Heuristic;

const BasicHeuristic = ({ heuristic, children }) => {
  return (
    <div style={{ display: "flex" }}>
      <span style={styles.heuristic}>
        {heuristic.heuristic}
      </span>

      {children}
    </div>
  );
};

class ExtendedHeuristic extends Component {
  constructor() {
    super();
    this.state = {
      top: 0,
      bottom: 0
    };

    this.range = [0, 1, 2, 3, 4, 5, 6];
  }

  componentDidMount() {
    const { heuristic } = this.props;
    let top = heuristic.options.fromTop ? heuristic.options.fromTop : 0;
    let bottom = heuristic.options.fromBottom
      ? heuristic.options.fromBottom
      : 0;

    this.setState({
      top,
      bottom
    });
  }

  handleSelectionChange(key, value) {
    if (key === "fromTop") {
      this.setState({
        top: value
      });
    } else if (key === "fromBottom") {
      this.setState({
        bottom: value
      });
    }

    let newHeuristic = Object.assign({}, this.props.heuristic);
    newHeuristic.options[key] = parseInt(value);
    this.props.onUpdate(newHeuristic);
  }

  render() {
    const { heuristic } = this.props;
    return (
      <BasicHeuristic heuristic={heuristic}>
        <div style={styles.parameter}>
          <Label>Top: </Label>
          <NumberSelect
            selected={this.state.top}
            range={this.range}
            onChange={value => this.handleSelectionChange("fromTop", value)}
          />
        </div>

        <div style={styles.parameter}>
          <Label>Bottom: </Label>
          <NumberSelect
            selected={this.state.bottom}
            range={this.range}
            onChange={value => this.handleSelectionChange("fromBottom", value)}
          />
        </div>
      </BasicHeuristic>
    );
  }
}

const styles = {
  container: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    border: "1px solid #eee",
    borderRadius: "5px",
    margin: "5px 0",
    padding: "5px"
  },
  leftSide: {
    display: "flex",
    flexGrow: "1",
    alignItems: "center"
  },
  move: {
    cursor: "pointer",
    backgroundColor: "#eee",
    padding: "0px 5px",
    fontSize: "1.8em",
    fontWeight: "100",
    color: "#999"
  },
  heuristic: {
    fontWeight: "bold",
    paddingLeft: "10px"
  },
  delete: {
    cursor: "pointer",
    color: "#D70A53",
    paddingRight: "10px"
  },
  parameter: {
    marginLeft: "10px",
    fontSize: ".9em",
    fontStyle: "italic",
    color: "#999"
  }
};
