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
import { FloatingContainer } from "../common/Container";
import { Code } from "../common/Code";
import { connect } from "react-redux";
import { setActiveLevel } from "../../actions";

class LevelHunk extends React.Component {
  render() {
    const { x, y, data } = this.props.node;
    let isVisible = this.props.activeLevel === this.props.index ? true : false;

    return (
      isVisible &&
      data.hunk &&
      <FloatingContainer
        overlay
        onClose={() => this.props.setActiveLevel(null)}
      >
        <div style={styles.header}>
          <h4>
            {data.hunk.fileName}
          </h4>
        </div>
        <Code linesOfCode={data.hunk.data.split("\n")} offset={0} />
      </FloatingContainer>
    );
  }
}

const mapStateToProps = state => {
  return {
    activeLevel: state.tree.activeLevel
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setActiveLevel: function(levelIndex) {
      dispatch(setActiveLevel(levelIndex));
    }
  };
};

const styles = {
  header: {
    padding: "10px"
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(LevelHunk);
