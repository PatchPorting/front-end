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
import FilterView from "./FilterView";
import Authorization from "../Form/Authorization";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { setFilter } from "../../actions";

class Filter extends React.Component {
  constructor() {
    super();
    this.state = {
      fixed: false,
      selectionSubmitted: false,
      successId: ""
    };
    this.scrollListener = this.handleScroll.bind(this);
  }

  componentDidMount() {
    window.addEventListener("scroll", this.scrollListener);
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.scrollListener);
  }

  handleScroll(event) {
    if (window.scrollY > 190 && !this.state.fixed) {
      this.setState({
        fixed: true
      });
    } else if (window.scrollY < 190 && this.state.fixed) {
      this.setState({
        fixed: false
      });
    }
  }

  handleSelection(key, value) {
    let obj = {};
    obj[key] = value;
    let filter = Object.assign({}, this.props.filter, obj);
    this.props.updateFilter(filter);
  }

  handleSelectionSubmit() {
    this.setState({
      selectionSubmitted: true
    });
  }

  handleSelectionCancel() {
    this.setState({
      selectionSubmitted: false
    });
  }

  handleProcessSuccess(responseData) {
    this.setState({
      successId: responseData.data.id
    });
  }

  render() {
    return (
      <div>
        <FilterView
          filter={this.props.filter}
          hunks={this.props.hunks}
          onSelection={this.handleSelection.bind(this)}
          isFixed={this.state.fixed}
          onSelectionSubmit={this.handleSelectionSubmit.bind(this)}
        />

        {this.state.selectionSubmitted &&
          <Authorization
            onCancel={this.handleSelectionCancel.bind(this)}
            onSubmit={this.props.onListSubmit}
            onSuccess={this.handleProcessSuccess.bind(this)}
            successOptions={[
              () =>
                <Link to={`/?build=${this.state.successId}`}>Go to build</Link>,
              () => <p onClick={() => this.handleSelectionCancel()}>Return</p>
            ]}
          />}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    filter: state.filter,
    hunks: state.hunkSet.hunks
  };
};

const mapDispatchToProps = dispatch => {
  return {
    updateFilter: filter => {
      dispatch(setFilter(filter));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Filter);
