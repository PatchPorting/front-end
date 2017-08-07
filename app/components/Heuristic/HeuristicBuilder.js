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
import ReactDOM from "react-dom";
import Heuristic from "./Heuristic";
import AddHeuristic from "./AddHeuristic";
import Button from "../Button/Button";
import Modal from "../common/Modal";
import { Form, FormGroup, Label, FormHeader, TextInput, Error } from "../Form";
import Authorization from "../Form/Authorization";
import { postHeuristic } from "../../utils/processData";

class HeuristicBuilder extends Component {
  constructor() {
    super();
    this.state = {
      name: "",
      heuristics: [],
      isSubmitted: false
    };
  }

  handleRemove(index) {
    this.setState({
      heuristics: [
        ...this.state.heuristics.slice(0, index),
        ...this.state.heuristics.slice(index + 1)
      ]
    });
  }

  handleAdd(type) {
    this.setState({
      heuristics: [...this.state.heuristics, getHeuristicFromType(type)]
    });
  }

  handleUpdate(heuristic, index) {
    this.setState({
      heuristics: [
        ...this.state.heuristics.slice(0, index),
        heuristic,
        ...this.state.heuristics.slice(index + 1)
      ]
    });
  }

  handleSubmit() {
    this.setState({
      error: ""
    });
    if (!this.state.name) {
      this.setState({
        error: "Please name your heuristic"
      });
      return;
    } else if (!this.state.heuristics.length) {
      this.setState({
        error: "Please include at lease one heuristic"
      });
    } else {
      this.setState({
        isSubmitted: true
      });
    }
  }

  handleSubmitProcessing(token) {
    return postHeuristic(
      {
        name: this.state.name,
        content: this.state.heuristics
      },
      token
    );
  }

  handleCancel() {
    this.setState({
      isSubmitted: false
    });
  }

  render() {
    const { onCancel } = this.props;
    return (
      <div>
        <Modal
          overlay
          title="Create New Heuristic"
          onClose={onCancel}
          onSubmit={this.handleSubmit.bind(this)}
        >
          <Form>
            {this.state.error &&
              <Error>
                {this.state.error}
              </Error>}
            <FormGroup>
              <Label>Name</Label>
              <TextInput
                value={this.state.name}
                onChange={name => this.setState({ name })}
              />
            </FormGroup>

            <FormGroup>
              <Label>Define your heuristic below: </Label>
            </FormGroup>

            {this.state.heuristics.map((heuristic, index) => {
              return (
                <Heuristic
                  key={index}
                  heuristic={heuristic}
                  onRemove={() => this.handleRemove(index)}
                  onUpdate={heuristic => this.handleUpdate(heuristic, index)}
                />
              );
            })}

            <hr />

            <AddHeuristic onAdd={this.handleAdd.bind(this)} />
          </Form>
        </Modal>

        {this.state.isSubmitted &&
          <Authorization
            onCancel={this.handleCancel.bind(this)}
            onSubmit={this.handleSubmitProcessing.bind(this)}
            onSuccess={this.props.onSuccess}
          />}
      </div>
    );
  }
}

const getHeuristicFromType = type => {
  switch (type) {
    case "Classical":
    case "Offset":
    case "IgnoreFilename":
      return { heuristic: type };
      break;

    case "Fuzz":
    case "FuzzIgnoreFilename":
      return {
        heuristic: type,
        options: {
          fromTop: 0,
          fromBottom: 0
        }
      };
      break;
  }
};

export default HeuristicBuilder;
