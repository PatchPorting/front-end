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
import Select from "react-select";

const CreateNew = ({ label }) => {
  return (
    <span>
      <i style={styles.icon}>+ </i>
      {label}
    </span>
  );
};

class Option extends React.Component {
  handleMouseDown(event) {
    event.preventDefault();
    event.stopPropagation();
    this.props.onMouseOver(null);
    this.props.onSelect(this.props.option, event);
  }
  handleMouseEnter(event) {
    let option = this.props.option.content ? this.props.option : null;
    this.props.onFocus(this.props.option, event);
    this.props.onMouseOver(option);
  }
  handleMouseLeave(event) {
    this.props.onMouseOver(null);
  }
  handleMouseMove(event) {
    if (this.props.isFocused) return;
    this.props.onFocus(this.props.option, event);
  }
  render() {
    const { option, children, className } = this.props;

    return (
      <div
        className={className}
        onMouseDown={this.handleMouseDown.bind(this)}
        onMouseEnter={this.handleMouseEnter.bind(this)}
        onMouseLeave={this.handleMouseLeave.bind(this)}
      >
        {option.value === "create-new"
          ? <CreateNew label={option.label} />
          : <span>
              {option.label}
            </span>}
      </div>
    );
  }
}

class CreatableSelect extends Component {
  constructor() {
    super();
    this.state = {
      value: null
    };
  }

  handleChange(newValue) {
    if (newValue && newValue.value === "create-new") {
      this.props.handleCreation();
    } else {
      this.props.handleSelectionChange(newValue);
    }
  }

  render() {
    const { options, value, onMouseOverItem } = this.props;

    let optionsList = [];

    let createNewOption = {
      label: "create new...",
      value: "create-new"
    };

    if (options) {
      optionsList = optionsList.concat(options);
    }

    optionsList.push(createNewOption);

    return (
      <Select
        className="custom-select"
        options={optionsList}
        optionComponent={props =>
          <Option {...props} onMouseOver={onMouseOverItem} />}
        onChange={this.handleChange.bind(this)}
        value={value}
        clearable={false}
        onClose={() => onMouseOverItem(null)}
      />
    );
  }
}

const styles = {
  icon: {
    fontSize: "1.3em",
    color: "#4990e2"
  }
};

export default CreatableSelect;
