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

import React, { Component } from "react";
import Modal from "../common/Modal";
import Loading from "../common/Loading";
import Button from "../Button/Button";

import {
  Form,
  FormGroup,
  FormHeader,
  Label,
  PasswordInput,
  Success,
  Error
} from "./";

class Authorization extends Component {
  constructor() {
    super();
    this.state = {
      token: "",
      isProcessing: false,
      error: "",
      success: ""
    };

    this.TOKEN_STORAGE_KEY = "patch.port.authorization.token";
  }

  componentDidMount() {
    const token = localStorage.getItem(this.TOKEN_STORAGE_KEY);
    if (token) {
      this.setState({
        token: token
      });
    }
  }

  handleChange(value) {
    this.setState({
      token: value
    });
  }

  submit() {
    if (this.state.isProcessing) return;

    localStorage.setItem(this.TOKEN_STORAGE_KEY, this.state.token);
    this.setState({ isProcessing: true, error: "", success: "" });
    this.props.onSubmit(this.state.token).then(res => {
      this.setState({ isProcessing: false });
      if (res.error) {
        this.setState({ error: res.error });
        return;
      } else {
        this.setState({ success: "Successfully submitted!" });
        if (this.props.onSuccess) {
          this.props.onSuccess(res);
        }
      }
    });
  }

  render() {
    const { onCancel, onSubmit, successOptions } = this.props;
    return (
      <div>
        <Modal overlay title="Authorization Required" onClose={onCancel}>
          {this.state.success
            ? <Success options={successOptions}>
                {this.state.success}
              </Success>
            : <Form>
                {this.state.error &&
                  <Error>
                    {this.state.error}
                  </Error>}

                <FormGroup>
                  <Label>Enter your authorization token:</Label>
                  <PasswordInput
                    value={this.state.token}
                    onChange={this.handleChange.bind(this)}
                  />
                </FormGroup>

                <FormGroup inline style={styles.rightAlign}>
                  {this.state.isProcessing &&
                    <Loading small style={styles.loading} />}

                  <Button
                    disabled={this.state.isPocessing}
                    onClick={this.submit.bind(this)}
                    name="Submit"
                  />
                </FormGroup>
              </Form>}
        </Modal>
      </div>
    );
  }
}

const styles = {
  loading: {
    margin: "-20px -10px",
    paddingTop: "20px"
  },
  rightAlign: {
    textAlign: "right"
  }
};

export default Authorization;
