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

const styles = {
  icon: {
    fontSize: "1.3em",
    color: "#4990e2"
  }
};

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

  handleOnClick() {
    console.log("clicked!");
  }

  renderOption(option) {
    if (option.value === "create-new") {
      return <CreateNew label={option.label} />;
    } else {
      return (
        <span>
          {option.label}
        </span>
      );
    }
  }

  render() {
    const { options, value, isLoading } = this.props;

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
        optionRenderer={this.renderOption}
        onChange={this.handleChange.bind(this)}
        value={value}
        clearable={false}
      />
    );
  }
}

export default CreatableSelect;
