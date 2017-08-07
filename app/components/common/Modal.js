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
import { FloatingContainer } from "./Container";
import CloseButton from "../Button/CloseButton";
import Button from "../Button/Button";

const Modal = ({ overlay, children, title, onClose, onSubmit }) => {
  return (
    <FloatingContainer overlay={overlay ? true : false} onClose={onClose}>
      <div style={styles.header}>
        <h4>
          {title}
        </h4>
      </div>
      <div style={styles.content}>
        <div style={styles.children}>
          {children}
        </div>
      </div>

      {onSubmit &&
        <div style={styles.footer}>
          <Button className="submit" onClick={onSubmit} name="Submit" />
        </div>}
    </FloatingContainer>
  );
};

const styles = {
  content: {
    overflow: "auto",
    flexGrow: "1"
  },
  children: {
    padding: "20px"
  },
  header: {
    padding: "15px 20px",
    width: "100%",
    borderBottom: "1px solid #ccc",
    display: "flex",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    zIndex: "100"
  },
  footer: {
    width: "100%",
    textAlign: "right",
    padding: "15px",
    borderTop: "1px solid #ccc",
    backgroundColor: "#fff"
  }
};

export default Modal;
