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

// Given a filter and array of hunks, return the filtered hunks
export const filterHunks = (filter, hunks) => {
  const { fileName, cve, provider } = filter;
  if (!fileName.length && !cve.length && !provider.length) {
    return hunks;
  } else {
    let filteredHunksByType = {
      fileName: [],
      cve: [],
      provider: []
    };

    let idToIndexMap = {};

    let filteredHunks = new Array(hunks.length);

    // Map hunk id to index
    for (let i = 0; i < hunks.length; i++) {
      hunks[i].index = i;
      idToIndexMap[hunks[i].id] = i;
    }

    // Get filtered list for each filter type
    for (let key in filter) {
      for (let i = 0; i < filter[key].length; i++) {
        filteredHunksByType[key] = filteredHunksByType[key].concat(
          hunks.filter(el => el[key] === filter[key][i].value)
        );
      }
    }

    // Get intersection of lists
    let intersection = null;
    for (let key in filteredHunksByType) {
      if (intersection && filteredHunksByType[key].length) {
        let set = new Set(filteredHunksByType[key]);
        intersection = new Set([...intersection].filter(el => set.has(el)));
      } else if (!intersection && filteredHunksByType[key].length) {
        intersection = new Set(filteredHunksByType[key]);
      }
    }

    if (intersection) {
      // Get filtered items
      for (let item of intersection) {
        filteredHunks[idToIndexMap[item.id]] = item;
      }
      return filteredHunks.filter(el => el !== undefined);
    } else {
      return [];
    }
  }
};

// Returns a filter given an array of hunks
export const getFilterForHunks = hunks => {
  let filter = {
    fileName: [],
    cve: [],
    provider: []
  };

  let map = {};

  let selectedHunks = hunks.filter(el => el.isSelected);
  for (let i = 0; i < selectedHunks.length; i++) {
    for (let key in filter) {
      if (!map[selectedHunks[i][key]]) {
        map[selectedHunks[i][key]] = 1;
        filter[key].push({
          label: selectedHunks[i][key],
          value: selectedHunks[i][key]
        });
      }
    }
  }
  return filter;
};

// Selects the hunks from all the hunks that exist in the build
export const selectHunks = (buildHunks, allHunks) => {
  let selectedHunks = allHunks.slice();
  let origHunks = {};
  for (let i = 0; i < buildHunks.length; i++) {
    if (buildHunks[i].id) {
      origHunks[buildHunks[i].id] = 1;
    }
  }
  for (let i = 0; i < selectedHunks.length; i++) {
    if (origHunks[selectedHunks[i].id]) {
      selectedHunks[i].isSelected = true;
    } else {
      selectedHunks[i].isSelected = false;
    }
  }
  return selectedHunks;
};

// Returns ordered of hunks matching original order of build
export const reorderHunks = (buildHunks, filteredHunks) => {
  let reorderedHunks = [];
  let map = {};
  for (let i = 0; i < filteredHunks.length; i++) {
    map[filteredHunks[i].id] = filteredHunks[i];
  }

  for (let i = 0; i < filteredHunks.length; i++) {
    if (i < buildHunks.length) {
      reorderedHunks.push(map[buildHunks[i].id]);
    } else {
      reorderedHunks.push(filteredHunks[i]);
    }
  }
  return reorderedHunks;
};

// Returns an array of items from an array given the item to be listed the the data
export const getList = (listItem, dataSet) => {
  let listItemsSet = {};
  let listItemsArray = [];
  for (var i = 0; i < dataSet.length; i++) {
    if (!listItemsSet[dataSet[i][listItem]]) {
      listItemsSet[dataSet[i][listItem]] = 1;
    }
  }

  for (var item in listItemsSet) {
    listItemsArray.push(item);
  }

  return listItemsArray;
};

// Returns list of options from setup request response
export const getOptions = setups => {
  let options = [];
  setups.forEach(setup => {
    options.push({
      label: setup.name,
      value: setup.id,
      content: setup.content
    });
  });
  return options;
};
