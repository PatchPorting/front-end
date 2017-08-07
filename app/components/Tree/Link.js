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

const Link = ({ data }) => {
  return <path style={styles.link} d={createLink(data)} />;
};

function createLink(d) {
  return (
    "M" +
    d.source.x +
    "," +
    d.source.y +
    "C" +
    d.source.x +
    "," +
    (d.source.y + d.target.y) / 2 +
    " " +
    d.target.x +
    "," +
    (d.source.y + d.target.y) / 2 +
    " " +
    d.target.x +
    "," +
    d.target.y
  );
}

const styles = {
  link: {
    fill: "none",
    strokeWidth: "2px",
    stroke: "#bbb",
    opacity: "1"
  }
};

export default Link;
