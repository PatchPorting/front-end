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
import Patch from "./Patch";
import NoContent from "../common/NoContent";
import { connect } from "react-redux";

class PatchList extends React.Component {
  constructor() {
    super();
  }

  render() {
    const { patches } = this.props;
    const donePatches = patches.filter(
      el => el.status === "done" && el.type === "build"
    );

    return patches.length
      ? donePatches.length
        ? <div className="patch-list-container">
            <SectionHeading>Patch List</SectionHeading>

            {donePatches.map((donePatch, index) => {
              return <Patch key={index} index={index} patch={donePatch} />;
            })}
          </div>
        : <NoContent>No successful patches</NoContent>
      : <NoContent>No patches available</NoContent>;
  }
}

const mapStateToProps = state => {
  return {
    patches: state.patch.patches
  };
};

export default connect(mapStateToProps, null)(PatchList);
