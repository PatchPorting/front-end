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

(function() {
  console.log("Running patch port status script...");
  var patchport = new Patchport();

  // Add custom styles to page
  addCustomCss();

  // Get CVE, return if not found
  var cve = document
    .getElementsByTagName("header")[0]
    .childNodes[0].textContent.trim();
  if (!cve) {
    console.log("SCRIPT STOPPED: CVE name not found on page.");
    return;
  }

  var cveId = null;

  // Get all tables
  var tables = document.getElementsByTagName("table");
  var table = null;

  // Get source package table, if doesn't exist, return
  if (tables.length > 1) {
    table = tables[1];
  } else {
    console.log("SCRIPT STOPPED: Source packages table not found on page.");
    return;
  }

  // Get rows of source package table, return if doesn't have any rows(packages)
  var rows = table.getElementsByTagName("tr");
  if (!rows.length > 1) {
    console.log("SCRIPT STOPPED: No rows found in source package table.");
    return;
  }

  // Get header row
  var headerRow = rows[0];

  // Add patcher column
  var col = document.createElement("th");
  col.innerHTML = "Patcher";
  headerRow.appendChild(col);

  // Get body rows
  var bodyRows = [];
  for (var i = 1; i < rows.length; i++) {
    // Create cell for each row in patcher column
    var td = document.createElement("td");
    td.className = "patch-status-cell";
    rows[i].appendChild(td);

    // If row has multiple releases, then uncouple the row
    if (rows[i].childNodes[1].textContent.split(",").length > 1) {
      uncoupleRow(rows[i], i + 1);
      rows = table.getElementsByTagName("tr");
    }

    // Add row to array of body rows
    bodyRows.push(rows[i]);
  }

  // Ignore header row
  var numberOfRows = bodyRows.length;

  // Get array of packages and properties
  var packages = {};
  var currPkg = null;
  for (var i = 0; i < numberOfRows; i++) {
    // Get package properties
    var packageName = bodyRows[i].childNodes[0].textContent
      .trim();
    var release = bodyRows[i].childNodes[1].textContent.trim();
    var version = bodyRows[i].childNodes[2].textContent.trim();
    var status = bodyRows[i].childNodes[3].textContent.trim();

    // New package entry
    if (packageName) {
      currPkg = packageName;
      packages[currPkg] = [
        {
          row: bodyRows[i],
          release: release,
          version: version,
          status: status
        }
      ];
    } else {
      // Not a new package, push to last package added
      packages[currPkg].push({
        row: bodyRows[i],
        release: release,
        version: version,
        status: status
      });
    }
  }
  
  let providerRequestsRemaining = 0;
  // Get patch information for each package and release
  getCveId(cve, function() {
    for (var package in packages) {
      packages[package].forEach(function(info) {
        getPatcherInfo(package, info);
      });
    }
  });

  /* --------------- Helper Functions --------------- */
  
  // Creates escaped where filter query parameter for requests
  function escapeFilter(obj) {
    return encodeURIComponent(JSON.stringify(obj));
  }

  function getCveId(cve, callback) {
    // Get CVE id
    var cveFilter = {where:{name: cve }};
    var getCveUrl = patchport.baseUrl + "/cves?filter=" + patchport.escapeFilter(cveFilter);
    patchport.fetchData(getCveUrl, function(responseData) {
      if (!responseData.length || !responseData[0].id) {
        console.log("NO CVE ID FOUND FOR CVE: " + cve);
        return;
      }
      cveId = responseData[0].id;
      callback();
    });
  }

  var allResponseData = {};
  // Makes request and retreives response data
  function getPatcherInfo(package, info) {
    // Build request url with package name and version
    var filter = {where:{
      pkgName: package.split(" ")[0],
      dist: info.release.split(" ")[0],
      cveIds: { inq: [cveId] }
    }};
    var url = patchport.baseUrl + "/builds?" + "filter=" + patchport.escapeFilter(filter);
    patchport.fetchData(url, function(responseData) {
      if (!responseData.length) {
        console.log(
          "NO RESPONSE DATA: Package: " +
            package +
            ", Release: " +
            info.release +
            ", Version: " +
            info.version
        );
        return;
      }
      providerRequestsRemaining += responseData.length;
      var id = package + '-' + info.release + '-' + info.version;
      if(!allResponseData[id]) allResponseData[id] = { info: info, data: responseData };
      handleData(package, info, responseData);
    });
  }

  // Handles response data from request
  function handleData(package, info, responseData) {
    getProviders(responseData, function() {
      providerRequestsRemaining--;
      if (providerRequestsRemaining == 0) {
        let data = Object.values(allResponseData);
        for (var i = 0; i < data.length; i++) {
          for (var j = 0; j < data[i].data.length; j++) {
            if(data[i].info.status !== 'fixed'){
              addPatchToRow(data[i].info.row, data[i].data[j]);
            }
          }
        }
        console.log("Patch port script finished!");
        return;
      }
    });
  }

  // Splits row with multiple releases into their own dedicated rows
  function uncoupleRow(row, index) {
    var tableIndex = index;
    var package = row.childNodes[0].innerHTML;
    var releases = row.childNodes[1].textContent.split(",");
    var version = row.childNodes[2].innerHTML;
    var status = row.childNodes[3].innerHTML;

    // Update the first row
    row.childNodes[1].textContent = releases[0];

    // Add the new rows after the original row
    for (var i = 1; i < releases.length; i++) {
      var newRow = table.insertRow(tableIndex);
      newRow.insertCell(0).innerHTML = package;
      newRow.insertCell(1).innerHTML = releases[i];
      newRow.insertCell(2).innerHTML = version;
      newRow.insertCell(3).innerHTML = status;
      tableIndex++;
    }
  }

  // Adds patch status to row
  function addPatchToRow(row, patch) {
    var patchCell = row.childNodes[row.childNodes.length - 1];
    var icon = patchport.getIcon(patch.status);
    var patchStatus = createPatchStatusElement(icon, patch);
    patchCell.appendChild(patchStatus);
  }

  // Creates patch status DOM element and attaches listeners
  function createPatchStatusElement(icon, patch) {
    var patchStatus = document.createElement("div");
    patchStatus.className = "patch-status";
    var redirectUrl = patchport.appUrl + "?build=" + patch.id;

    var providerInfo = getProviderInfo(patch.hunks);

    var popOver = document.createElement("div");
    popOver.className = "patch-info-popover hidden";
    popOver.innerHTML =
      '<p><span class="bold">Status:</span></p><p class="details">' +
      patch.status +
      "</p>" +
      '<p><span class="bold">Mode:</span></p><p class="details">' +
      patch.mode +
      "</p>" +
      '<p><span class="bold">Hunks:</span></p><p class="details">' +
      patch.hunks.length +
      "</p>" +
      '<p><span class="bold">Provider:</span></p><p class="details">' +
      providerInfo +
      "</p>";

    var patchIcon = document.createElement("span");
    patchIcon.className = "icon";
    patchIcon.innerHTML = '<a href="' + redirectUrl + '">' + icon + "</a>";

    createPatchHoverEventListener(patchIcon);
    createIframeEventListener(patchIcon.getElementsByTagName("a")[0]);

    patchStatus.appendChild(patchIcon);
    patchStatus.appendChild(popOver);

    return patchStatus;
  }

  // Create event listeners for clicking on patch status
  function createPatchHoverEventListener(element) {
    // Show popver
    element.addEventListener("mouseover", function(e) {
      element.className += " selected";
      element.nextSibling.classList.toggle("hidden");
    });

    // Hide popover
    element.addEventListener("mouseout", function(e) {
      element.className = "icon";
      element.nextSibling.classList.toggle("hidden");
    });
  }

  function createIframeEventListener(element) {
    element.addEventListener("click", function(e) {
      e.preventDefault();
      showIframe(element.href);
    });
  }

  function showIframe(url) {
    var body = document.getElementsByTagName("body")[0];
    body.className = "no-scroll";

    var iframeContainer = document.getElementsByClassName("iframe-container");
    var iframe = null;

    if (iframeContainer.length) {
      iframeContainer = iframeContainer[0];
    } else {
      iframeContainer = createIframe();
    }

    iframeContainer.style.display = "block";
    iframe = iframeContainer.childNodes[1];
    iframe.src = url;
    showOverlay();
  }

  function closeIframe(iframeContainer) {
    var body = document.getElementsByTagName("body")[0];
    body.className = "";

    iframeContainer.style.display = "none";
    iframeContainer.childNodes[1].src = "";
    hideOverlay();
  }

  function createIframe() {
    // Create iframe container
    var iframeContainer = document.createElement("div");
    iframeContainer.className = "iframe-container";

    // Create iframe
    var iframe = document.createElement("iframe");
    iframe.className = "patch-port-iframe";

    document.getElementsByTagName("body")[0].appendChild(iframeContainer);

    // Create header for iframe
    var header = document.createElement("div");
    header.className = "iframe-header";

    // Add close button to iframe header
    var closeBtn = document.createElement("div");
    closeBtn.className = "iframe-close";
    closeBtn.innerHTML = "&#10005";
    header.appendChild(closeBtn);

    // Add header to iframe
    iframeContainer.appendChild(header);
    iframeContainer.appendChild(iframe);

    // Add event listener for closing the iframe
    closeBtn.addEventListener("click", function() {
      closeIframe(iframeContainer);
    });

    return iframeContainer;
  }

  function showOverlay() {
    var overlay = document.getElementsByClassName("overlay");
    if (overlay.length) {
      overlay = overlay[0];
    } else {
      overlay = document.createElement("div");
      overlay.className = "overlay";
      document.getElementsByTagName("body")[0].appendChild(overlay);
    }

    overlay.style.display = "block";
  }

  function hideOverlay() {
    var overlay = document.getElementsByClassName("overlay")[0];
    overlay.style.display = "none";
  }

  var hunkIdToHunkMap = {};
  var patchsetIdToPatchset = {};
  var providerIdToProvider = {};

  function getProviders(responseData, callback) {
    for (let j = 0; j < responseData.length; j++) {
      var hunkIds = {};
      for (let i = 0; i < responseData[j].hunks.length; i++) {
        if (!hunkIdToHunkMap[responseData[j].hunks[i].id]) {
          hunkIdToHunkMap[responseData[j].hunks[i].id] = 1;
          hunkIds[responseData[j].hunks[i].id] = 1;
        }
      }

      populateMap(hunkIds, "hunks", ["id", "patchsetId"], function(map) {
        hunkIdToHunkMap = Object.assign(hunkIdToHunkMap, map);
        var patchsetIds = {};
        for (var key in map) {
          if (!patchsetIdToPatchset[map[key].patchsetId]) {
            patchsetIdToPatchset[map[key].patchsetId] = 1;
            patchsetIds[map[key].patchsetId] = 1;
          }
        }

        populateMap(patchsetIds, "patchsets", ["id", "providerId"], function(map) {
          patchsetIdToPatchset = Object.assign(patchsetIdToPatchset, map);
          var providerIds = {};
          for (var key in map) {
            if (!providerIdToProvider[map[key].providerId]) {
              providerIdToProvider[map[key].providerId] = 1;
              providerIds[map[key].providerId] = 1;
            }
          }

          populateMapWithIdFilter(providerIds, "providers", function(map) {
            providerIdToProvider = Object.assign(providerIdToProvider, map);
            callback();
          });
        });
      });
    }
  }

  function populateMap(map, endpoint, fields, callback) {
    let mapped = Object.assign({}, map);
    let responses = [];
    let requests = 0;
    let fieldFilter = fields.length ? { fields: fields } : {};
    if (!Object.keys(mapped).length) callback({});
    
    for (var key in mapped) {
      var request = patchport.baseUrl + "/" + endpoint + "/" + key + "?filter=" + escapeFilter(fieldFilter);
      patchport.fetchData(request, function(responseData) {
        responses.push(responseData);
        requests++;
        if (requests == Object.keys(mapped).length) {
          for(var i = 0; i < responses.length; i++) {
            mapped[responses[i].id] = responses[i];
          }
          callback(mapped);
        }
      });
    }
  }

  function populateMapWithIdFilter(map, endpoint, callback) {
    let mapped = Object.assign({}, map);
    let requests = 0;
    var responses = [];
    if (!Object.keys(mapped).length) callback({});

    for (var key in mapped) {
      let filter = escapeFilter({where:{ id: key }});
      let request = patchport.baseUrl + "/" + endpoint + "?filter=" + filter;
      patchport.fetchData(request, function(responseData) {
        responses.push(responseData.length ? responseData[0] : {});
        requests++;
        if (requests == Object.keys(mapped).length) {
          for(var i = 0; i < responses.length; i++) {
            mapped[responses[i].id] = responses[i];
          }
          callback(mapped);
        }
      });
    }
  }

  function getProviderInfo(hunks) {
    let providers = [];
    let providersMap = {};
    for (var i = 0; i < hunks.length; i++) {
      var hunk = hunkIdToHunkMap[hunks[i].id];
      var patchset = patchsetIdToPatchset[hunk.patchsetId];
      if (!providersMap[patchset.providerId]) {
        providersMap[patchset.providerId] = 1;
        providers.push(providerIdToProvider[patchset.providerId].name);
      }
    }

    return providers.length > 1 ? providers.join(", ") : providers[0];
  }

  /* --------------- CSS Styling --------------- */

  // Adds a custom stylesheet to page
  function addCustomCss() {
    css =
      "table td.patch-status-cell .patch-status .icon a" +
      "{color: black;" +
      "text-decoration: none;}";

    css += "body.no-scroll" + "{overflow: hidden;}";

    // css +=
    //   "table td.patch-status-cell .patch-status .icon" +
    //   "{padding: 0 3px;" +
    //   "font-size: .9em;}";

    css +=
      "table td.patch-status-cell .patch-status" +
      "{display: inline;" +
      "position: relative;}";

    css +=
      "table td.patch-status-cell .patch-status .patch-info-popover" +
      "{position: absolute;" +
      "bottom: 30px;" +
      "left: -10px;" +
      "background-color: #fff;" +
      "padding: 10px;" +
      "z-index: 1;" +
      "min-width: 65px;" +
      "-moz-filter: drop-shadow(#ccc 0 0 5px);" +
      "filter: drop-shadow(#ccc 0 0 5px);}";

    css +=
      "table td.patch-status-cell .patch-status .patch-info-popover:after" +
      '{content: "";' +
      "position: absolute;" +
      "bottom: -10px;" +
      "left: 9px;" +
      "border-style: solid;" +
      "border-width: 10px 10px 0;" +
      "border-color: #FFFFFF transparent;" +
      "display: block;" +
      "width: 0;" +
      "z-index: 1;}";

    css +=
      "table td.patch-status-cell .patch-status .patch-info-popover p" +
      "{margin: 0;}";

    css +=
      "table td.patch-status-cell .patch-status .patch-info-popover p.details" +
      "{padding-left: 10px;}";

    css +=
      ".iframe-container" +
      "{position: fixed;" +
      "width: 90%;" +
      "height: 90%;" +
      "top: 50%;" +
      "left: 50%;" +
      "transform: translate(-50%, -50%);" +
      "z-index: 10;" +
      "border-radius: 10px;" +
      "background-color: white}";

    css +=
      ".iframe-container .patch-port-iframe" +
      "{border: none;" +
      "width: 100%;" +
      "height: calc(100% - 25px);" +
      "overflow: scroll;}";

    css +=
      ".iframe-container .iframe-header" +
      "{height: 25px;" +
      "background-color: #D70A53;" +
      "color: white;" +
      "text-align: right;" +
      "padding: 0 10px;" +
      "font-size: 1.3em;" +
      "border-radius: 10px 10px 0 0;}";

    css +=
      ".iframe-container .iframe-header .iframe-close" +
      "{cursor: pointer;" +
      "display: inline;}";

    css +=
      ".overlay" +
      "{position: fixed;" +
      "display: none;" +
      "width: 100%;" +
      "height: 100%;" +
      "top: 0px;" +
      "left: 0px;" +
      "background-color: #0009;" +
      "z-index: 5;}";

    var style = document.createElement("style");

    if (style.styleSheet) {
      style.styleSheet.cssText = css;
    } else {
      style.appendChild(document.createTextNode(css));
    }

    document.getElementsByTagName("head")[0].appendChild(style);
  }
})();
