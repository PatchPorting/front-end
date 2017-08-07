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

// HTTP Request dependencies
import axios from "axios";

const baseUrl = "https://patchport-http.mybluemix.net/api/v0";

// Retrieve build info
export const fetchBuildInfo = (buildId, oncomplete) => {
  let filter = escapeFilter({ where: { id: buildId }, include: "results" });
  let buildRequest = `${baseUrl}/builds?filter=${filter}`;
  let promises = [];

  axios.get(buildRequest).then(async res => {
    if (res.data.length) {
      let buildData = Object.assign({}, res.data[0]);
      let hunkIdToHunk = {};
      let cveIdToCve = {};

      // Map cve id to cve model
      Object.assign(cveIdToCve, createMapOfIds(buildData.cveIds));
      cveIdToCve = await populateMap(cveIdToCve, "cves");

      // Populate list of cves
      buildData.cves = [];
      for (let id in cveIdToCve) {
        buildData.cves.push(cveIdToCve[id].name);
      }

      // Map hunk id to hunk model
      Object.assign(hunkIdToHunk, createMapOfIds(buildData.hunks, "id"));
      hunkIdToHunk = await populateMap(hunkIdToHunk, "hunks");

      // Populate list of hunk ids with their respective hunk model
      for (let i = 0; i < buildData.results.length; i++) {
        if (buildData.results[i].data.hunkId) {
          buildData.results[i].data.hunk = getObjectFromId(
            buildData.results[i].data.hunkId,
            hunkIdToHunk
          );
        }
      }

      oncomplete(buildData);
    }
  });
};

// Retrieve all hunks for package and version
// Currently a slow process due to the many requests being made to populate ids with respective models
export const fetchHunks = (pkgName, pkgVersion, oncomplete) => {
  let filter = escapeFilter({
    where: { mode: "default", pkgName, pkgVersion },
    fields: ["hunks", "cveIds"]
  });
  let request = `${baseUrl}/builds?filter=${filter}`;

  axios.get(request).then(async res => {
    if (res.data.length) {
      let data = res.data;

      let cveIdToCve = {};
      let hunkIdToHunk = {};
      let setupIdToSetup = {};
      let patchIdToPatch = {};
      let patchsetIdToPatchset = {};
      let providerIdToProvider = {};

      let hunks = [];

      for (let i = 0; i < data.length; i++) {
        Object.assign(cveIdToCve, createMapOfIds(data[i].cveIds));
        Object.assign(hunkIdToHunk, createMapOfIds(data[i].hunks, "id"));
        Object.assign(setupIdToSetup, createMapOfIds(data[i].hunks, "setupId"));
      }

      cveIdToCve = await populateMap(cveIdToCve, "cves");
      hunkIdToHunk = await populateMap(hunkIdToHunk, "hunks");
      setupIdToSetup = await populateMap(setupIdToSetup, "setups");

      Object.assign(patchIdToPatch, createMapOfIds(hunkIdToHunk, "patchId"));
      patchIdToPatch = await populateMapWithIdFilter(patchIdToPatch, "patches");

      Object.assign(
        patchsetIdToPatchset,
        createMapOfIds(hunkIdToHunk, "patchsetId")
      );
      patchsetIdToPatchset = await populateMap(
        patchsetIdToPatchset,
        "patchsets"
      );

      Object.assign(
        providerIdToProvider,
        createMapOfIds(patchsetIdToPatchset, "providerId")
      );
      providerIdToProvider = await populateMapWithIdFilter(
        providerIdToProvider,
        "providers"
      );

      let hunksToCount = {};
      for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < data[i].hunks.length; j++) {
          if (!hunksToCount[data[i].hunks[j].id]) {
            hunksToCount[data[i].hunks[j].id] = 1;
            hunks.push(data[i].hunks[j]);
          }
        }
      }

      for (let i = 0; i < hunks.length; i++) {
        Object.assign(hunks[i], getObjectFromId(hunks[i].id, hunkIdToHunk));
        Object.assign(hunks[i], {
          cve: getObjectFromId(hunks[i].cveId, cveIdToCve).name
        });
        Object.assign(hunks[i], {
          setup: getObjectFromId(hunks[i].setupId, setupIdToSetup).name
        });
        Object.assign(hunks[i], {
          patchUrl: getObjectFromId(hunks[i].patchId, patchIdToPatch).url
        });
        Object.assign(hunks[i], {
          providerId: getObjectFromId(hunks[i].patchsetId, patchsetIdToPatchset)
            .providerId
        });
        Object.assign(hunks[i], {
          provider: getObjectFromId(hunks[i].providerId, providerIdToProvider)
            .name
        });

        Object.assign(hunks[i], { isSelected: true });
      }

      hunks = numerateProviders(hunks);

      oncomplete(hunks);
    }
  });
};

// Populates a map of ids with their respective model
function populateMap(map, endpoint) {
  let mapped = Object.assign({}, map);
  let promises = [];
  for (let key in mapped) {
    let request = `${baseUrl}/${endpoint}/${key}`;
    promises.push(axios.get(request));
  }

  return axios.all(promises).then(results => {
    results.forEach(res => {
      mapped[res.data.id] = res.data;
    });
    return mapped;
  });
}

// Popluates map of ids using filter rather than id as query param
function populateMapWithIdFilter(map, endpoint) {
  let mapped = Object.assign({}, map);
  let promises = [];

  for (let key in map) {
    let filter = escapeFilter({ where: { id: key } });
    let request = `${baseUrl}/${endpoint}?filter=${filter}`;
    promises.push(axios.get(request));
  }
  return axios.all(promises).then(results => {
    results.forEach(res => {
      mapped[res.data[0].id] = res.data[0];
    });
    return mapped;
  });
}

// returns object from map given id
function getObjectFromId(id, obj) {
  let newObj = Object.assign({}, obj[id]);
  return newObj;
}

// Given a list of ids (array or object), creates map of ids with no duplicates
function createMapOfIds(obj, key = null) {
  let map = {};
  if (obj instanceof Array) {
    let arr = obj;
    for (let i = 0; i < arr.length; i++) {
      if (key && !map[arr[i][key]]) {
        map[arr[i][key]] = null;
      } else if (!key && !map[arr[i]]) {
        map[arr[i]] = null;
      }
    }
  } else if (obj instanceof Object) {
    for (let item in obj) {
      if (key && !map[obj[item][key]]) {
        map[obj[item][key]] = null;
      }
    }
  }
  return map;
}

// Retrieves all setups available for hunks
export const fetchSetups = oncomplete => {
  let request = `${baseUrl}/setups`;
  axios.get(request).then(res => {
    oncomplete(res.data);
  });
};

// Numerates providers for visualization purposes
function numerateProviders(hunks) {
  let newHunks = [];
  let providersToCount = {};
  let providers = {};
  let counter = 0;

  for (let i = 0; i < hunks.length; i++) {
    let provider = hunks[i].provider;
    let patchUrl = hunks[i].patchUrl;
    let countedProvider = providersToCount[hunks[i].provider];
    let numerated = providers[patchUrl];

    if (!countedProvider) {
      providersToCount[provider] = 0;
    }

    if (numerated) {
      let numeratedProvider = {
        numeratedProvider: `${provider}-${providers[patchUrl]}`
      };
      let newHunk = Object.assign({}, hunks[i], numeratedProvider);
      newHunks.push(newHunk);
    } else {
      providersToCount[provider]++;
      providers[patchUrl] = providersToCount[provider];

      let numeratedProvider = {
        numeratedProvider: `${provider}-${providers[patchUrl]}`
      };
      let newHunk = Object.assign({}, hunks[i], numeratedProvider);
      newHunks.push(newHunk);
    }
  }

  return newHunks;
}

// Encodes filter object to be used as query param
function escapeFilter(filter) {
  return encodeURIComponent(JSON.stringify(filter));
}
