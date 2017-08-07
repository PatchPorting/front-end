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

export const setFilter = filter => {
  return {
    type: "SET_FILTER",
    filter
  };
};

export const setBuild = build => {
  return {
    type: "SET_BUILD",
    build
  };
};

export const setResult = result => {
  return {
    type: "SET_RESULT",
    result
  };
};

export const setPatches = patches => {
  return {
    type: "SET_PATCHES",
    patches
  };
};

export const updateHunks = hunks => {
  return {
    type: "UPDATE_HUNKS",
    hunks
  };
};

export const updateConfigs = configs => {
  return {
    type: "UPDATE_CONFIGS",
    configs
  };
};

export const updateHunkConfiguration = (id, configId) => {
  return {
    type: "UPDATE_HUNK_CONFIGURATION",
    id,
    configId
  };
};

export const updateAllHunkConfigurations = configId => {
  return {
    type: "UPDATE_ALL_HUNK_CONFIGURATIONS",
    configId
  };
};

export const updateHunkSelection = (id,selection) => {
	return {
		type: "UPDATE_HUNK_SELECTION",
		id,
		selection
	};
};

export const setActiveNode = nodeIndex => {
  return {
    type: "SET_ACTIVE_NODE",
    nodeIndex
  };
};

export const setActiveLevel = levelIndex => {
  return {
    type: "SET_ACTIVE_LEVEL",
    levelIndex
  };
};
