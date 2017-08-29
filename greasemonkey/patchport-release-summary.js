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
  console.log("Running patch port summary script...");
  var patchport = new Patchport();

  // Get all tables
  var tables = document.getElementsByTagName("table");
  var table = null;

  // Get packages table, if doesn't exist, return
  if (tables.length > 0) {
    table = tables[0];
  } else {
    console.log("SCRIPT STOPPED: Packages table not found on page.");
    return;
  }

  // Get rows of open issues table, return if doesn't have any rows(packages)
  var rows = table.getElementsByTagName("tr");
  if (!rows.length > 1) {
    console.log("SCRIPT STOPPED: No rows found in packages table.");
    return;
  }

  // Get header row
  var headerRow = rows[0];

  // Add summary column
  headerRow.insertCell(2).outerHTML = "<th>Summary</th>";
  for (var i = 1; i < rows.length; i++) {
    rows[i].insertCell(2);
  }

  // Get array of packages and properties
  var packages = {};
  var currPkg = null;
  for (var i = 1; i < rows.length; i++) {
    var pkgName = rows[i].childNodes[0].textContent.trim();
    var cve = rows[i].childNodes[1].textContent.trim();

    if (pkgName) {
      currPkg = pkgName;
      packages[currPkg] = [
        {
          row: rows[i],
          cve: cve
        }
      ];
    } else {
      packages[currPkg].push({
        row: rows[i],
        cve: cve
      });
    }
  }

  // Map CVEs
  var cveMap = {};
  for (var i = 1; i < rows.length; i++) {
    if (!cveMap[rows[i].childNodes[1].textContent]) {
      cveMap[rows[i].childNodes[1].textContent] = 1;
    }
  }

  // Once CVEs are mapped to IDs, get respective builds
  populateCveMap(cveMap, function(resultingMap) {
    totalRequests = rows.length - 1;
    numberOfRequests = 0;
    for (var package in packages) {
      packages[package].forEach(function(info) {
        // Return if no ID was found for this CVE
        if (resultingMap[info.cve] === 1) {
          numberOfRequests++;
          return;
        }

        var filter = patchport.escapeFilter({
          where: { pkgName: package, cveIds: { inq: [resultingMap[info.cve]] } }
        });
        var request = patchport.baseUrl + "/builds?filter=" + filter;

        // Get build data for package and CVE
        patchport.fetchData(request, function(responseData) {
          numberOfRequests++;
          if (responseData && responseData.length) {
            info.numberOfPatches = responseData.length;

            // Numerate patch statuses
            info.statuses = {};
            for (var i = 0; i < responseData.length; i++) {
              if (info.statuses[responseData[i].status]) {
                info.statuses[responseData[i].status]++;
              } else {
                info.statuses[responseData[i].status] = 1;
              }
            }
          }

          if (numberOfRequests === totalRequests) {
            for (var package in packages) {
              packages[package].forEach(function(info) {
                // Add total number of patches to cell
                if (info.numberOfPatches) {
                  info.row.childNodes[2].innerHTML = info.numberOfPatches;
                }

                // Add numerated statuses to cell
                if (info.statuses) {
                  info.row.childNodes[2].innerHTML += " | ";
                  for (var status in info.statuses) {
                    info.row.childNodes[2].innerHTML +=
                      ' <span class="icon">' +
                      info.statuses[status] +
                      patchport.getIcon(status) +
                      "</span>";
                  }
                }
              });
            }
            console.log("Patch port script finished!");
          }
        });
      });
    }
  });

  // Populates CVE map with their respective IDs
  function populateCveMap(map, callback) {
    var totalRequests = Object.keys(map).length;
    var numberOfRequests = 0;
    var responses = [];
    for (var cve in map) {
      var filter = patchport.escapeFilter({ where: { name: cve } });
      var request = patchport.baseUrl + "/cves?filter=" + filter;
      patchport.fetchData(request, function(responseData) {
        if (responseData && responseData[0]) {
          map[responseData[0].name] = responseData[0].id;
        }
        numberOfRequests++;
        if (numberOfRequests === totalRequests) {
          callback(map);
        }
      });
    }
  }
})();
