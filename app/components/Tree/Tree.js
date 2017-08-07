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
import SectionHeading from "../Heading/SectionHeading";
import TreeView from "./TreeView";
import Loading from "../common/Loading";
import NoContent from "../common/NoContent";
import { constructTree } from "../../utils/tree";
import { connect } from "react-redux";
import { setPatches } from "../../actions";

class Tree extends React.Component {
  constructor() {
    super();
    this.state = {
      isLoading: true,
      tree: null,
      numOfNodes: 0
    };
  }

  componentDidMount() {
    let tree = constructTree(this.props.result);
    this.setState(
      {
        tree: tree,
        isLoading: false
      },
      () => {
        let patches = this.state.tree ? this.state.tree.leaves : [];
        this.props.setPatches(patches);
      }
    );
  }

  render() {
    return this.state.isLoading
      ? <Loading />
      : this.state.tree
        ? <div className="tree-container">
            <SectionHeading>Patch Tree</SectionHeading>
            <TreeView
              tree={this.state.tree}
              numOfNodes={this.props.result.length}
            />
          </div>
        : <NoContent>No patch tree available</NoContent>;
  }
}

const mapStateToProps = state => {
  return {
    result: state.patch.result
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setPatches: patches => {
      dispatch(setPatches(patches));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Tree);
