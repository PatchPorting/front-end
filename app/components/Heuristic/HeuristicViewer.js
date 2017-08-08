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

const HeuristicViewer = ({ option }) => {
  return (
    <div style={styles.container}>
      <div style={styles.heading}>
        {option.label}
      </div>
      <div style={styles.body}>
        {option.content.map((item, key) => {
          return (
            <div key={key}>
              {item.heuristic}
              {item.options &&
                <span style={styles.options}>
                  <span>
                    Top: {item.options.fromTop || 0} | Bottom:{" "}
                    {item.options.fromBottom || 0}
                  </span>
                </span>}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const styles = {
  container: {
    position: "absolute",
    left: "100%",
    backgroundColor: "#fff",
    zIndex: "110",
    minHeight: "200px",
    boxShadow: "0 0 5px #ccc",
    borderRadius: "5px",
    minWidth: "200px"
  },
  heading: {
    padding: "10px",
    marginBottom: "5px",
    borderBottom: "1px solid #ddd",
    fontWeight: "bold",
    fontSize: "1em"
  },
  body: {
    padding: "10px"
  },
  options: {
    paddingLeft: "5px",
    color: "#aaa",
    whiteSpace: "nowrap",
    fontStyle: "italic"
  }
};

export default HeuristicViewer;
