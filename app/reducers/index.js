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

import { combineReducers } from "redux";

const initialFilter = {
  fileName: [],
  cve: [],
  provider: []
};

const initialBuild = {
  id: "",
  cves: [],
  pkgName: "",
  version: "",
  status: "",
  dist: ""
};

const initialPatch = {
  result: [],
  patches: []
};

const initialHunkSet = {
  hunks: [],
  filteredHunks: [],
  configs: []
};

const initialTree = {
  activeNode: null,
  activeLevel: null
};

const filter = (state = initialFilter, action) => {
  switch (action.type) {
    case "SET_FILTER":
      return Object.assign({}, action.filter);
    default:
      return state;
  }
};

const build = (state = initialBuild, action) => {
  switch (action.type) {
    case "SET_BUILD":
      return Object.assign({}, state, action.build);
    default:
      return state;
  }
};

const patch = (state = initialPatch, action) => {
  switch (action.type) {
    case "SET_RESULT":
      return Object.assign({}, state, { result: action.result });
    case "SET_PATCHES":
      return Object.assign({}, state, { patches: action.patches });
    default:
      return state;
  }
};

const hunkSet = (state = initialHunkSet, action) => {
  switch (action.type) {
    case "UPDATE_HUNKS":
      return Object.assign({}, state, { hunks: action.hunks });
    case "UPDATE_CONFIGS":
      return Object.assign({}, state, { configs: action.configs });
    case "UPDATE_HUNK_CONFIGURATION":
      let updatedHunksWithNewConfig = state.hunks.map(item => {
        if (item.id === action.id)
          return Object.assign({}, item, { setupId: action.configId });
        return item;
      });
      return Object.assign({}, state, { hunks: updatedHunksWithNewConfig });
    case "UPDATE_ALL_HUNK_CONFIGURATIONS":
      let allHunksWithNewConfig = state.hunks.map(item => {
        return Object.assign({}, item, { setupId: action.configId });
      });
      return Object.assign({}, state, {
        hunks: allHunksWithNewConfig
      });
    case "UPDATE_HUNK_SELECTION":
      let updatedHunksWithNewSelection = state.hunks.map(item => {
        if (item.id === action.id)
          return Object.assign({}, item, { isSelected: action.selection });
        return item;
      });
      return Object.assign({}, state, { hunks: updatedHunksWithNewSelection });
    default:
      return state;
  }
};

const tree = (state = initialTree, action) => {
  switch (action.type) {
    case "SET_ACTIVE_NODE":
      return Object.assign({}, state, { activeNode: action.nodeIndex });
    case "SET_ACTIVE_LEVEL":
      return Object.assign({}, state, { activeLevel: action.levelIndex });
    default:
      return state;
  }
};

const reducer = combineReducers({
  filter,
  build,
  hunkSet,
  tree,
  patch
});

export default reducer;
