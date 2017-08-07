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
import HunkHeader from "./HunkHeader";
import HunkData from "./HunkData";
import { connect } from "react-redux";
import { updateHunkSelection } from "../../actions";

class Hunk extends React.Component {
  constructor() {
    super();
    this.state = {
      hunkIsSelected: true
    };
  }

  componentDidMount() {
    this.setState({
      hunkIsSelected: this.props.hunk.isSelected
    });
  }

  handleToggleHunkSelection() {
    let hunkIsSelected = this.state.hunkIsSelected;
    this.setState(
      {
        hunkIsSelected: !hunkIsSelected
      },
      () => {
        this.props.updateHunkSelection(
          this.props.hunk.id,
          this.state.hunkIsSelected
        );
      }
    );
  }

  render() {
    let data = this.props.hunk.data.replace(/\\n/g, "\n").split("\n");
    let dataHeight = data.length * 17;

    return (
      <div
        className={`hunk-container \
							${this.state.hunkIsSelected ? "hunk-selected" : ""}`}
      >
        <HunkHeader
          hunk={this.props.hunk}
          onHunkSelectToggle={this.handleToggleHunkSelection.bind(this)}
          isSelected={this.state.hunkIsSelected}
        />

        <HunkData data={data} />
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    updateHunkSelection: (id, selection) => {
      dispatch(updateHunkSelection(id, selection));
    }
  };
};

export default connect(null, mapDispatchToProps)(Hunk);
