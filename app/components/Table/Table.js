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

const Table = ({ header, body }) =>
  <table className="debian-style-table" width="100%">
    <tbody>
      <tr>
        {header.map((heading, index) =>
          <th key={index}>
            {heading}
          </th>
        )}
      </tr>

      {body.map((dataset, index) =>
        <tr key={index}>
          {dataset.map((data, index) =>
            <td key={index}>
              {data.map((item, index) => {
                return (
                  <div key={index} style={styles} className={item.className && item.className}>
                    {item.link
                      ? <a href={item.link} target="_top">
                          {item.value}{index !== data.length-1 && ','}&nbsp;
                        </a>
                      : <span>
                          {item.value} &nbsp;
                        </span>}
                  </div>
                );
              })}
            </td>
          )}
        </tr>
      )}
    </tbody>
</table>;

const styles = {
	display: 'inline-block'
};

export default Table;
