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
import NodeLog from "./NodeLog";
import { connect } from "react-redux";

class NodePopover extends React.Component {
  constructor() {
    super();
    this.state = {
      showLogs: false
    };
  }

  closeLog() {
    this.setState({
      showLogs: false
    });
  }

  showLog() {
    this.setState({
      showLogs: true
    });
  }

  render() {
    const { x, y, data } = this.props.node;
    let isVisible = this.props.activeNode === this.props.index ? true : false;
    let containerStyle = Object.assign({}, styles.container, {
      top: `${y + 65}px`,
      left: `${x + 20}px`
    });
    return (
      isVisible &&
      <div>
        <div className={this.props.className} style={containerStyle}>
          <ul style={styles.menu}>
            <li style={styles.item} onClick={() => this.showLog()}>
              View Logs
            </li>
          </ul>
        </div>

        {this.state.showLogs &&
          <NodeLog logs={data.log} closeLog={this.closeLog.bind(this)} />}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    activeNode: state.tree.activeNode
  };
};

const styles = {
  container: {
    position: "absolute",
    backgroundColor: "white",
    display: "inline-block",
    borderRadius: "5px",
    zIndex: "10",
    MozFilter: "drop-shadow(#ccc 0 0 4px)",
    filter: "drop-shadow(#ccc 0 0 4px)"
  },
  menu: {
    listStyle: "none",
    margin: "0",
    padding: "0",
    color: "#000"
  },
  item: {
    padding: "5px 10px",
    borderBottom: "1px solid #ddd",
    whiteSpace: "nowrap"
  }
};

export default connect(mapStateToProps)(NodePopover);
