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
import { FloatingContainer } from "../common/Container";
import { CloseButton } from "../Button/CloseButton";
import NoContent from "../common/NoContent";

const NodeLog = ({ closeLog, logs }) => {
  return (
    <FloatingContainer onClose={closeLog}>
      <div style={styles.heading}>
        <h4>Logs</h4>
      </div>

      <div style={styles.body}>
        <div style={styles.logs}>
          {logs.length
            ? logs.map((log, key) => {
                return (
                  <p key={key} style={styles.line}>
                    {log}
                  </p>
                );
              })
            : <NoContent transparent>No logs available...</NoContent>}
        </div>
      </div>
    </FloatingContainer>
  );
};

const styles = {
  heading: {
    backgroundColor: "#000",
    padding: "5px 10px",
    color: "#fff"
  },
  body: {
    backgroundColor: "rgba(0, 0, 0, 0.79)",
    overflowY: "auto",
    color: "#fff"
  },
  logs: {
    padding: "10px",
    minHeight: "300px"
  },
  line: {
    margin: "0"
  }
};

export default NodeLog;
