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
import Loading from "../common/Loading";
import Filter from "../Filter/Filter";
import HunkListView from "./HunkListView";
import { fetchHunks, fetchSetups } from "../../utils/fetchData";
import { processBuild } from "../../utils/processData";
import {
  selectHunks,
  getFilterForHunks,
  filterHunks,
  getOptions,
  reorderHunks
} from "../../utils/filter";
import { connect } from "react-redux";
import {
  updateHunks,
  setFilter,
  updateConfigs
} from "../../actions";

class HunkList extends React.Component {
  constructor() {
    super();
    this.state = {
      isLoading: true,
      filteredHunks: []
    };
  }

  componentDidMount() {
    fetchHunks(
      this.props.build.pkgName,
      this.props.build.pkgVersion,
      allHunks => {
        let hunks = selectHunks(this.props.build.hunks, allHunks);
        let filter = getFilterForHunks(hunks);
		let filteredHunks = filterHunks(filter, hunks);
		filteredHunks = reorderHunks(this.props.build.hunks, filteredHunks);

        this.props.setHunks(hunks);
        this.props.setFilter(filter);

        fetchSetups(setups => {
          let configs = getOptions(setups);
          this.props.updateConfigs(configs);
          this.setState({
            isLoading: false,
            filteredHunks
          });
        });
      }
    );
  }

  componentWillReceiveProps(nextprops) {
    if (this.props.filter !== nextprops.filter) {
      let filteredHunks = this.getFilteredHunks(nextprops.filter);
      this.setState({ filteredHunks });
    } else if (
      this.props.hunkSet.hunks !== nextprops.hunkSet.hunks &&
      this.state.filteredHunks
    ) {
      let filteredHunks = [];
      for (let i = 0; i < this.state.filteredHunks.length; i++) {
        filteredHunks.push(
          nextprops.hunkSet.hunks[this.state.filteredHunks[i].index]
        );
      }
      this.setState({
        filteredHunks
      });
    }
  }

  reorder(index, direction) {
    let filteredHunks = this.state.filteredHunks;
    let delta = direction === "up" ? -1 : direction === "down" ? 1 : 0;
    let temp = filteredHunks[index + delta];
    filteredHunks[index + delta] = filteredHunks[index];
    filteredHunks[index] = temp;
    this.setState({ filteredHunks });
  }

  getFilteredHunks(filter) {
    let filteredHunks = filterHunks(filter, this.props.hunkSet.hunks);
    return filteredHunks;
  }

  handleHunksSubmit(token) {
	let filteredHunks = this.state.filteredHunks.filter(el => el.isSelected);
    return processBuild(this.props.build, filteredHunks, token);
  }

  render() {
    return this.state.isLoading
      ? <Loading />
      : <div className="hunk-list-container">
          <Filter onListSubmit={this.handleHunksSubmit.bind(this)} />
          <HunkListView
            isLoading={this.state.isLoading}
            hunks={this.state.filteredHunks}
            move={this.reorder.bind(this)}
          />
        </div>;
  }
}

const mapStateToProps = state => {
  return {
    hunkSet: state.hunkSet,
    build: state.build,
    result: state.patch.result,
    filter: state.filter
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setHunks: hunks => {
      dispatch(updateHunks(hunks));
    },
    setFilter: filter => {
      dispatch(setFilter(filter));
    },
    updateConfigs: configs => {
      dispatch(updateConfigs(configs));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(HunkList);
