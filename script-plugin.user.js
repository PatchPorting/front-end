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

// ==UserScript==
// @name        patch-porting
// @namespace   joseph.schwarz@ibm.com
// @description Extends debian source package table
// @include     https://security-tracker.debian.org/tracker/*
// @version     1
// @grant       none
// ==/UserScript==

(function() {
  var scripts = {
    status: "status",
    release: "release-summary",
    sourcePackage: "source-package"
  };

  var baseUrl = "https://patch-port.mybluemix.net";

  var debianUrl = "https://security-tracker.debian.org";
  var path = window.location.href.replace(debianUrl, "").trim();

  var scriptToRun = null;
  if (path.match(/^\/tracker\/source-package\/[\w-]+\/?$/)) {
    scriptToRun = scripts.sourcePackage;
  } else if (path.match(/\/tracker\/status\/release\/[\w-]+\/?$/)) {
    scriptToRun = scripts.release;
  } else if (path.match(/\/tracker\/[\w-]+\/?$/)) {
    scriptToRun = scripts.status;
  }

  if (scriptToRun) {
    fetchFile(baseUrl + "/greasemonkey/patchport-functions.js", function(data) {
      var body = document.getElementsByTagName("body")[0];
      var globalFunctions = document.createElement("script");
      globalFunctions.innerHTML = data;
      body.appendChild(globalFunctions);
      var scriptTag = document.createElement("script");

      switch (scriptToRun) {
        case scripts.status:
          scriptTag.src = baseUrl + "/greasemonkey/patchport-status.js";
          body.appendChild(scriptTag);
          break;
        case scripts.release:
          scriptTag.src =
            baseUrl + "/greasemonkey/patchport-release-summary.js";
          body.appendChild(scriptTag);
          break;
        case scripts.sourcePackage:
          scriptTag.src =
            baseUrl + "/greasemonkey/patchport-package-summary.js";
          body.appendChild(scriptTag);
          break;
      }
    });
  }

  function fetchFile(url, callback) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
      if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
        callback(xmlHttp.responseText);
      }
      if (xmlHttp.readyState == 4 && xmlHttp.status == 404) {
        callback(null);
      }
    };

    xmlHttp.open("GET", url, true);
    xmlHttp.send(null);
  }
})();
