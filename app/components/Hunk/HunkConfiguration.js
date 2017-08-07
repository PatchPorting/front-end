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
import CreatableSelect from "../Form/Select/CreatableSelect";
import HeuristicBuilder from "../Heuristic/HeuristicBuilder";
import { fetchSetups } from "../../utils/fetchData";
import { getOptions } from "../../utils/filter";
import { connect } from "react-redux";
import {
  updateHunkConfiguration,
  updateAllHunkConfigurations,
  updateConfigs
} from "../../actions";

class HunkConfiguration extends React.Component {
  constructor() {
    super();
    this.state = {
      selected: null,
      isCreatingNewConfig: false
    };
  }

  componentDidMount() {
    this.setState({
      selected: this.props.hunk.setupId
    });
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.selected !== nextProps.hunk.setupId) {
      this.setState({
        selected: nextProps.hunk.setupId
      });
    }
  }

  handleConfigurationSelection(selection) {
    this.setState({ selected: selection.value });
    this.props.updateHunkConfiguration(this.props.hunk.id, selection.value);
  }

  handleCreateNewConfiguration() {
    this.setState({
      isCreatingNewConfig: true
    });
  }

  handleCancel() {
    this.setState({
      isCreatingNewConfig: false
    });
  }

  handleSuccess(responseData) {
    fetchSetups(setups => {
      let configs = getOptions(setups);
      this.props.updateConfigs(configs);
      this.setState({
        selected: responseData.data.id
      });
      this.handleCancel();
    });
  }

  applyToAllHunks() {
    this.props.updateAllHunkConfigurations(this.state.selected);
  }

  render() {
    return (
      <div className="hunk-configuration">
        <div style={styles.linkContainer}>
          <span style={styles.link} onClick={() => this.applyToAllHunks()}>
            Apply to all
          </span>
        </div>
        <CreatableSelect
          options={this.props.configs}
          value={this.state.selected}
          handleSelectionChange={this.handleConfigurationSelection.bind(this)}
          handleCreation={this.handleCreateNewConfiguration.bind(this)}
        />

        {this.state.isCreatingNewConfig &&
          <HeuristicBuilder
            default={this.props.configs[0].content}
            onCancel={this.handleCancel.bind(this)}
            onSuccess={this.handleSuccess.bind(this)}
          />}
      </div>
    );
  }
}

const styles = {
  linkContainer: {
    textAlign: "right",
    fontSize: ".9em",
    paddingRight: "10px",
    paddingBottom: "5px",
    color: "#337ab8"
  },
  link: {
    cursor: "pointer"
  }
};

const mapStateToProps = state => {
  return {
    configs: state.hunkSet.configs
  };
};

const mapDispatchToProps = dispatch => {
  return {
    updateHunkConfiguration: (id, value) => {
      dispatch(updateHunkConfiguration(id, value));
    },
    updateAllHunkConfigurations: id => {
      dispatch(updateAllHunkConfigurations(id));
    },
    updateConfigs: configs => {
      dispatch(updateConfigs(configs));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(HunkConfiguration);
