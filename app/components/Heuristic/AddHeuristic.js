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

const AddHeuristic = ({ onAdd }) => {
  const types = [
    "Classical",
    "Offset",
    "IgnoreFilename",
    "Fuzz",
    "FuzzIgnoreFilename"
  ];
  return (
    <div style={styles.container}>
      {types.map((type, index) => {
        return (
          <div
            className="heuristic-add"
            key={index}
            style={styles.add}
            onClick={() => onAdd(type)}
          >
            <i style={styles.icon}>+ </i>
            {type}
          </div>
        );
      })}
    </div>
  );
};

const styles = {
  container: {
    color: "#999",
    display: "flex",
    flexFlow: "row wrap"
  },
  add: {
    padding: "5px",
    backgroundColor: "#eee",
    borderRadius: "5px",
    margin: "5px",
    textAlign: "center",
    cursor: "pointer"
  },
  icon: {
    color: "#D70A53"
  }
};

export default AddHeuristic;
