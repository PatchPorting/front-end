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

import { getList } from "./filter";

// HTTP Request dependencies
import axios from "axios";

const baseUrl = "https://patchport-http.mybluemix.net/api/v0";

// Post a new build to be processed
export const processBuild = (build, hunks, token) => {
  let request = `${baseUrl}/builds?access_token=${token}`;
  let cveIds = getList("cveId", hunks);
  let hunksForPost = hunks.map(hunk => {
    return {
      id: hunk.id,
      setupId: hunk.setupId
    };
  });

  let buildData = {
    pkgName: build.pkgName,
    pkgVersion: build.pkgVersion,
    dist: build.dist,
    mode: "manual",
    status: "waiting",
    cveIds: cveIds,
    hunks: hunksForPost
  };

  return axios
    .post(request, buildData)
    .then(res => {
      return res;
    })
    .catch(error => {
      return {
        error: error.message
      };
    });
};

// Post a new heuristic configuration
export const postHeuristic = (heuristic, token) => {
  let request = `${baseUrl}/setups?access_token=${token}`;

  return axios
    .post(request, heuristic)
    .then(res => {
      return res;
    })
    .catch(error => {
      return {
        error: error.message
      };
    });
};
