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
import Hunk from "./Hunk";
import HunkReorder from "./HunkReorder";
import FlipMove from "react-flip-move";
import NoContent from "../common/NoContent";

class HunkListView extends React.Component {
  constructor() {
    super();
  }

  render() {
    return (
      <div className="hunk-list">
        {this.props.hunks.length
          ? <FlipMove
              duration={300}
              easing="ease-out"
              enterAnimation="none"
              leaveAnimation="none"
            >
              {this.props.hunks.map((hunk, index) => {
                return (
                  <div key={hunk.id} className="hunk-row">
                    {this.props.hunks.length > 1 &&
                      <HunkReorder
                        moveUp={() => this.props.move(index, "up")}
                        moveDown={() => this.props.move(index, "down")}
                      />}
                    <Hunk hunk={hunk} />
                  </div>
                );
              })}
            </FlipMove>
          : <NoContent>No hunks found</NoContent>}
      </div>
    );
  }
}

export default HunkListView;
