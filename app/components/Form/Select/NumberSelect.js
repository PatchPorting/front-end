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

const NumberSelect = ({ range, selected, onChange }) => {
  return (
    <select
      style={styles}
      defaultValue={selected}
      onChange={e => onChange(e.target.value)}
    >
      {range.map((number, index) => {
        return (
          <option key={index} value={number}>
            {number}
          </option>
        );
      })}
    </select>
  );
};

const styles = {
  border: "1px solid #c2e0ff",
  borderRadius: "5px",
  backgroundColor: "#fff",
  WebkitAppearance: "none",
  MozAppearance: "none",
  appearance: "none",
  width: "20px",
  paddingLeft: "2px"
};

export default NumberSelect;
